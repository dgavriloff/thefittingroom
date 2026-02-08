import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { Redis } from '@upstash/redis';

export const config = {
  maxDuration: 60,
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const FREE_LIMIT = 5;
const SUB_MONTHLY_LIMIT = 100;
const LOCK_TTL = 120; // seconds

interface GenerateRequest {
  deviceId: string;
  prompt: string;
  imageData: { mimeType: string; data: string }[];
  aspectRatio: string;
  modelName?: string;
}

const RC_PROJECT_ID = '95c0e4e2';

async function checkRevenueCatEntitlement(deviceId: string): Promise<{
  isProSubscriber: boolean;
}> {
  const apiKey = process.env.REVENUECAT_API_KEY;
  if (!apiKey) return { isProSubscriber: false };

  try {
    const res = await fetch(
      `https://api.revenuecat.com/v2/projects/${RC_PROJECT_ID}/customers/${encodeURIComponent(deviceId)}/active_entitlements`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) return { isProSubscriber: false };

    const data = await res.json();
    const items = data?.items || [];
    // V2 API returns entitlement_id (internal ID), not a human-readable name.
    // Since our only entitlement is "pro", any active entitlement means pro access.
    const hasPro = items.length > 0;

    return { isProSubscriber: hasPro };
  } catch (err) {
    console.error('[RC] Error checking entitlement:', err);
    return { isProSubscriber: false };
  }
}

async function checkEntitlement(deviceId: string): Promise<{
  allowed: boolean;
  source: 'subscription' | 'credits' | 'free';
  freeUsed: number;
  credits: number;
  subUsed: number;
  subLimit: number;
  isProSubscriber: boolean;
}> {
  const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM

  const [freeUsed, credits, subUsed, rcStatus] = await Promise.all([
    redis.get<number>(`free:${deviceId}`) ?? 0,
    redis.get<number>(`credits:${deviceId}`) ?? 0,
    redis.get<number>(`sub_used:${deviceId}:${monthKey}`) ?? 0,
    checkRevenueCatEntitlement(deviceId),
  ]);

  const freeCount = freeUsed ?? 0;
  const creditCount = credits ?? 0;
  const subCount = subUsed ?? 0;
  const { isProSubscriber } = rcStatus;

  // 1. Active subscription with remaining quota
  if (isProSubscriber && subCount < SUB_MONTHLY_LIMIT) {
    return {
      allowed: true,
      source: 'subscription',
      freeUsed: freeCount,
      credits: creditCount,
      subUsed: subCount,
      subLimit: SUB_MONTHLY_LIMIT,
      isProSubscriber,
    };
  }

  // 2. Credits available
  if (creditCount > 0) {
    return {
      allowed: true,
      source: 'credits',
      freeUsed: freeCount,
      credits: creditCount,
      subUsed: subCount,
      subLimit: SUB_MONTHLY_LIMIT,
      isProSubscriber,
    };
  }

  // 3. Free tier
  if (freeCount < FREE_LIMIT) {
    return {
      allowed: true,
      source: 'free',
      freeUsed: freeCount,
      credits: 0,
      subUsed: subCount,
      subLimit: SUB_MONTHLY_LIMIT,
      isProSubscriber,
    };
  }

  // No generations available
  return {
    allowed: false,
    source: 'free',
    freeUsed: freeCount,
    credits: 0,
    subUsed: subCount,
    subLimit: SUB_MONTHLY_LIMIT,
    isProSubscriber,
  };
}

async function deductGeneration(
  deviceId: string,
  source: 'subscription' | 'credits' | 'free'
): Promise<void> {
  const monthKey = new Date().toISOString().slice(0, 7);

  switch (source) {
    case 'subscription': {
      const key = `sub_used:${deviceId}:${monthKey}`;
      await redis.incr(key);
      // Set TTL of 45 days if not already set
      const ttl = await redis.ttl(key);
      if (ttl < 0) {
        await redis.expire(key, 45 * 24 * 60 * 60);
      }
      break;
    }
    case 'credits':
      await redis.decr(`credits:${deviceId}`);
      break;
    case 'free':
      await redis.incr(`free:${deviceId}`);
      break;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS: block browser requests (native apps don't send Origin)
  if (req.headers.origin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Validate shared secret
  const appSecret = req.headers['x-app-secret'];
  if (appSecret !== process.env.APP_SECRET) {
    return res.status(403).json({ error: 'Invalid app secret' });
  }

  const body = req.body as GenerateRequest;
  const { deviceId, prompt, imageData, aspectRatio, modelName } = body;

  if (!deviceId || !prompt || !imageData || !Array.isArray(imageData)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check entitlement
  const entitlement = await checkEntitlement(deviceId);
  if (!entitlement.allowed) {
    return res.status(402).json({
      error: 'No generations remaining',
      generations: {
        freeUsed: entitlement.freeUsed,
        freeLimit: FREE_LIMIT,
        credits: entitlement.credits,
        subUsed: entitlement.subUsed,
        subLimit: entitlement.subLimit,
      },
    });
  }

  // Gate pro model behind subscription
  const PRO_MODELS = ['gemini-3-pro-image-preview'];
  const requestedModel = modelName || 'gemini-2.5-flash-image';
  if (PRO_MODELS.includes(requestedModel) && !entitlement.isProSubscriber) {
    return res.status(403).json({ error: 'Pro model requires active subscription' });
  }

  // Acquire concurrency lock
  const lockKey = `lock:${deviceId}`;
  const lockAcquired = await redis.set(lockKey, '1', { nx: true, ex: LOCK_TTL });
  if (!lockAcquired) {
    return res.status(429).json({ error: 'Generation already in progress' });
  }

  // 55s abort controller (leave 5s buffer for cleanup)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55000);

  try {
    const parts: any[] = [{ text: prompt }];
    for (const img of imageData) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType,
          data: img.data,
        },
      });
    }

    const response = await ai.models.generateContent(
      {
        model: requestedModel,
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      },
      { signal: controller.signal } as any
    );

    let resultImageUrl: string | null = null;
    let resultText: string | null = null;
    let isSafetyBlock = false;

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      const reason = candidate.finishReason;

      if (
        reason === 'SAFETY' ||
        reason === 'IMAGE_SAFETY' ||
        reason === 'BLOCKLIST' ||
        reason === 'PROHIBITED_CONTENT' ||
        reason === 'IMAGE_PROHIBITED_CONTENT'
      ) {
        isSafetyBlock = true;
      }

      if (reason === 'RECITATION') {
        isSafetyBlock = true;
      }

      if (reason === 'LANGUAGE') {
        isSafetyBlock = true;
      }

      if (!isSafetyBlock) {
        const content = candidate.content;
        if (content && content.parts) {
          for (const part of content.parts) {
            if (part.inlineData) {
              resultImageUrl = `data:image/png;base64,${part.inlineData.data}`;
            } else if (part.text) {
              resultText = part.text;
            }
          }
        }
      }
    }

    if (isSafetyBlock) {
      // Safety blocks don't count against quota
      return res.status(200).json({
        error: 'Image rejected due to safety guidelines. Please try different images or prompts.',
        safetyBlock: true,
        generations: {
          freeUsed: entitlement.freeUsed,
          freeLimit: FREE_LIMIT,
          credits: entitlement.credits,
          subUsed: entitlement.subUsed,
          subLimit: entitlement.subLimit,
        },
      });
    }

    if (!resultImageUrl && !resultText) {
      return res.status(500).json({ error: 'Generation failed. The model returned no content.' });
    }

    // Deduct generation on success
    await deductGeneration(deviceId, entitlement.source);

    // Get updated counts
    const monthKey = new Date().toISOString().slice(0, 7);
    const [newFreeUsed, newCredits, newSubUsed] = await Promise.all([
      redis.get<number>(`free:${deviceId}`),
      redis.get<number>(`credits:${deviceId}`),
      redis.get<number>(`sub_used:${deviceId}:${monthKey}`),
    ]);

    return res.status(200).json({
      imageUrl: resultImageUrl,
      text: resultText,
      generations: {
        freeUsed: newFreeUsed ?? 0,
        freeLimit: FREE_LIMIT,
        credits: newCredits ?? 0,
        subUsed: newSubUsed ?? 0,
        subLimit: SUB_MONTHLY_LIMIT,
      },
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Generation timed out. Please try again.' });
    }
    console.error('Generate error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    clearTimeout(timeout);
    await redis.del(lockKey);
  }
}
