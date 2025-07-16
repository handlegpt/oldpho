import { NextApiRequest, NextApiResponse } from 'next';
import { queueProcessor } from '../../../lib/queue-processor';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Start the queue processor
    queueProcessor.start();
    
    const status = queueProcessor.getStatus();
    
    return res.status(200).json({
      success: true,
      message: 'Queue processor started successfully',
      status
    });

  } catch (error) {
    console.error('Error starting queue processor:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 