import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { photoRestorationQueue } from '../../../lib/redis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get job ID from request body
    const { jobId } = req.body;
    if (!jobId || typeof jobId !== 'string') {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Get user ID from session
    const userId = session.user.email!;

    // Cancel job
    const result = await photoRestorationQueue.cancelJob(jobId, userId);

    if (!result) {
      return res.status(400).json({ 
        error: 'Job could not be cancelled. It may already be processing or completed.' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Job cancelled successfully',
    });

  } catch (error) {
    console.error('Error cancelling job:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 