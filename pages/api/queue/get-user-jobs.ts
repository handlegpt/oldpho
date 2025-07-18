import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { photoRestorationQueue } from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user ID from session
    const userId = session.user.email!;

    // Get user's jobs from queue
    const jobs = await photoRestorationQueue.getUserJobs(userId);

    // Get queue statistics
    const stats = await photoRestorationQueue.getQueueStats();

    return res.status(200).json({
      success: true,
      jobs,
      queueStats: stats,
    });

  } catch (error) {
    console.error('Error getting user jobs:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 