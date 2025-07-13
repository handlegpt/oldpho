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
    // Query the redis database by email to get the number of generations left
    const identifier = session.user.email;
    const windowDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
    const bucket = Math.floor(Date.now() / windowDuration);

    let usedGenerations = 0;
    
    if (redis) {
      try {
        usedGenerations = Number(await redis.get(`@upstash/ratelimit:${identifier!}:${bucket}`)) || 0;
      } catch (error) {
        console.error('Redis error:', error);
        // Fallback to 0 if Redis fails
        usedGenerations = 0;
      }
    }

    // Calculate remaining time until reset (30 days from first use)
    const firstUseDate = new Date(Date.now() - (usedGenerations * windowDuration));
    const resetDate = new Date(firstUseDate.getTime() + windowDuration);
    
    const diff = Math.abs(resetDate.getTime() - new Date().getTime());
    const days = Math.floor(diff / 1000 / 60 / 60 / 24);
    const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    const remainingGenerations = Math.max(0, 5 - Number(usedGenerations));

    return res.status(200).json({ 
      remainingGenerations, 
      days,
      hours, 
      minutes,
      usedGenerations: Number(usedGenerations)
    });
  } catch (error) {
    console.error('Remaining API error:', error);
    return res.status(500).json({ 
      remainingGenerations: 5, 
      days: 30,
      hours: 0, 
      minutes: 0,
      usedGenerations: 0
    });
  }
}
