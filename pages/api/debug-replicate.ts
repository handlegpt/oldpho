import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

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

    const debugInfo = {
      timestamp: new Date().toISOString(),
      replicateApiToken: process.env.REPLICATE_API_TOKEN ? 'Configured' : 'Not configured',
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      user: session.user.email,
    };

    // Test Replicate API if token is configured
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const testResponse = await fetch('https://api.replicate.com/v1/models', {
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });

        if (testResponse.ok) {
          debugInfo.replicateApiStatus = 'Connected';
        } else {
          debugInfo.replicateApiStatus = `Error: ${testResponse.status} ${testResponse.statusText}`;
        }
      } catch (error) {
        debugInfo.replicateApiStatus = `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    } else {
      debugInfo.replicateApiStatus = 'Not tested (no token)';
    }

    return res.status(200).json(debugInfo);

  } catch (error) {
    console.error('Debug API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 