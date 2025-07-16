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

    const { imageUrl, originalImageUrl, priority = 'normal' } = req.body;

    // Validate input
    if (!imageUrl || !originalImageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate priority
    if (!['high', 'normal', 'low'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    // Add job to queue
    const jobId = await photoRestorationQueue.addJob({
      userId: session.user.id || session.user.email!,
      userEmail: session.user.email!,
      imageUrl,
      originalImageUrl,
      priority,
      maxRetries: 3,
    });

    // Get queue statistics
    const stats = await photoRestorationQueue.getQueueStats();

    return res.status(200).json({
      success: true,
      jobId,
      message: 'Job added to queue successfully',
      queueStats: stats,
    });

  } catch (error) {
    console.error('Error adding job to queue:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 