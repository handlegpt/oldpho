import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = {
      providers: authOptions.providers.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type
      })),
      email: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        user: process.env.EMAIL_SERVER_USER ? '***configured***' : 'missing',
        pass: process.env.EMAIL_SERVER_PASS ? '***configured***' : 'missing',
        from: process.env.EMAIL_FROM
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ? '***configured***' : 'missing',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ? '***configured***' : 'missing'
      },
      nextauth: {
        url: process.env.NEXTAUTH_URL,
        secret: process.env.NEXTAUTH_SECRET ? '***configured***' : 'missing'
      }
    };

    res.status(200).json({
      status: 'ok',
      config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Auth test error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
