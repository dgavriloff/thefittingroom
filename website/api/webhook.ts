import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const CREDIT_PACK_MAP: Record<string, number> = {
  'credits_25': 25,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate RevenueCat webhook authorization
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.REVENUECAT_WEBHOOK_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const event = req.body;
    const eventType = event?.event?.type;
    const appUserId = event?.event?.app_user_id;

    if (!appUserId || !eventType) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    switch (eventType) {
      // Credit pack purchased (non-consumable or consumable)
      case 'NON_RENEWING_PURCHASE':
      case 'INITIAL_PURCHASE': {
        const productId = event?.event?.product_id;
        const creditAmount = CREDIT_PACK_MAP[productId];
        if (creditAmount) {
          await redis.incrby(`credits:${appUserId}`, creditAmount);
        }
        break;
      }

      // Subscription renewal — reset monthly counter
      case 'RENEWAL': {
        const monthKey = new Date().toISOString().slice(0, 7);
        const key = `sub_used:${appUserId}:${monthKey}`;
        await redis.set(key, 0);
        await redis.expire(key, 45 * 24 * 60 * 60);
        break;
      }

      // Subscription started
      case 'SUBSCRIBER_ALIAS':
      case 'TRANSFER':
        // No-op, entitlement is checked via API
        break;

      default:
        // Log unhandled events for debugging
        console.log(`Unhandled RevenueCat event: ${eventType}`);
        break;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
