import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { queueProcessor } from '../../lib/queue-processor';

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

    // Check Replicate API token
    const hasReplicateToken = !!process.env.REPLICATE_API_TOKEN;
    
    // Check queue processor status
    const queueStatus = queueProcessor.getStatus();
    
    // Check environment variables
    const envCheck = {
      REPLICATE_API_TOKEN: hasReplicateToken ? 'Configured' : 'Not configured',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Configured' : 'Not configured',
    };

    return res.status(200).json({
      success: true,
      replicate: {
        tokenConfigured: hasReplicateToken,
        message: hasReplicateToken ? 'Ready to use Replicate API' : 'Replicate API token not configured'
      },
      queue: {
        isRunning: queueStatus.isRunning,
        checkInterval: queueStatus.checkInterval,
        message: queueStatus.isRunning ? 'Queue processor is running' : 'Queue processor is not running'
      },
      environment: envCheck,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 