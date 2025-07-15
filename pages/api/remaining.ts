import type { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../utils/redis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json('Method not allowed');
  }

  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json('Login to upload.');
  }

  try {
    // For now, provide fallback behavior without database
    // This ensures the app works even without Prisma setup
    const rateLimit: number = 5; // Free plan default
    const isFreeUser = true;
    const planId = 'free';

    // Query the redis database by email to get the number of generations left
    const identifier = session.user.email;
    
    // Use the same 30-day window as in generate.ts
    const windowDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const now = Date.now();
    const bucket = Math.floor(now / windowDuration);
    const bucketStartTime = bucket * windowDuration;
    const nextResetTime = bucketStartTime + windowDuration;

    // Debug information
    console.log('Time calculation debug:', {
      now: new Date(now).toISOString(),
      bucket,
      bucketStartTime: new Date(bucketStartTime).toISOString(),
      nextResetTime: new Date(nextResetTime).toISOString(),
      windowDuration: windowDuration / (1000 * 60 * 60 * 24) + ' days'
    });

    let usedGenerations = 0;
    
    if (redis && rateLimit !== -1) {
      try {
        // Use the same key format as Upstash Ratelimit
        const key = `@upstash/ratelimit:${identifier!}:${bucket}`;
        usedGenerations = Number(await redis.get(key)) || 0;
      } catch (error) {
        console.error('Redis error:', error);
        // Fallback to 0 if Redis fails
        usedGenerations = 0;
      }
    }

    // Calculate remaining time until reset (30 days from bucket start)
    const timeUntilReset = nextResetTime - now;
    const days = Math.floor(timeUntilReset / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));

    // Debug time calculation
    console.log('Time until reset:', {
      timeUntilReset: timeUntilReset / (1000 * 60 * 60 * 24) + ' days',
      days,
      hours,
      minutes
    });

    const remainingGenerations = rateLimit === -1 ? -1 : Math.max(0, rateLimit - Number(usedGenerations));

    return res.status(200).json({ 
      remainingGenerations, 
      days,
      hours, 
      minutes,
      usedGenerations: Number(usedGenerations),
      isFreeUser,
      planId
    });
  } catch (error) {
    console.error('Remaining API error:', error);
    return res.status(500).json({ 
      remainingGenerations: 5, 
      days: 30,
      hours: 0, 
      minutes: 0,
      usedGenerations: 0,
      isFreeUser: true,
      planId: 'free'
    });
  }
}
