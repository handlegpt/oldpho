import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user session
    const session = await getServerSession(req, res);
    
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Return basic user info without database dependency
    const userInfo = {
      id: session.user.email, // Use email as ID
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      plan: 'free', // Default to free plan
      remainingGenerations: 5, // Default limit
      isFreeUser: true
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.error('User info API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 