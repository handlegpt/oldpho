import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return mock analytics data
    const analytics = {
      totalGenerations: 15,
      thisMonth: 3,
      thisWeek: 1,
      averageQuality: 4.2,
      favoriteStyle: 'vintage',
      lastUsed: new Date().toISOString(),
      plan: 'free',
      isFreeUser: true
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error('User analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 