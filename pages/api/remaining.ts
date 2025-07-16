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

    // Return remaining generations for the user
    const remainingGenerations = 5; // Default for free users
    const isFreeUser = true;
    const plan = 'free';

    res.status(200).json({
      remainingGenerations,
      isFreeUser,
      plan,
      resetTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    });
  } catch (error) {
    console.error('Remaining API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
