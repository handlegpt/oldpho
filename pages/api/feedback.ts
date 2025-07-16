import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { message, type, rating } = req.body;

    // Log feedback
    console.log('User feedback:', {
      user: session.user.email,
      message,
      type,
      rating,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 