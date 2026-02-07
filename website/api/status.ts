import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const FREE_LIMIT = 3;
const SUB_MONTHLY_LIMIT = 100;

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
  } catch {
    return { isProSubscriber: false };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.headers.origin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const appSecret = req.headers['x-app-secret'];
  if (appSecret !== process.env.APP_SECRET) {
    return res.status(403).json({ error: 'Invalid app secret' });
  }

  const { deviceId } = req.body as { deviceId: string };

  if (!deviceId) {
    return res.status(400).json({ error: 'Missing deviceId' });
  }

  const monthKey = new Date().toISOString().slice(0, 7);

  const [freeUsed, credits, subUsed, rcStatus] = await Promise.all([
    redis.get<number>(`free:${deviceId}`),
    redis.get<number>(`credits:${deviceId}`),
    redis.get<number>(`sub_used:${deviceId}:${monthKey}`),
    checkRevenueCatEntitlement(deviceId),
  ]);

  return res.status(200).json({
    freeUsed: freeUsed ?? 0,
    freeLimit: FREE_LIMIT,
    credits: credits ?? 0,
    subscription: {
      active: rcStatus.isProSubscriber,
      used: subUsed ?? 0,
      limit: SUB_MONTHLY_LIMIT,
      proModelAccess: rcStatus.isProSubscriber,
    },
  });
}
