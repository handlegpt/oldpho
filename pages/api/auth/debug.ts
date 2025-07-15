import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const envCheck = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
  };

  // Check if required variables are missing
  const missingVars = [];
  if (!process.env.NEXTAUTH_URL) missingVars.push('NEXTAUTH_URL');
  if (!process.env.NEXTAUTH_SECRET) missingVars.push('NEXTAUTH_SECRET');
  if (!process.env.GOOGLE_CLIENT_ID) missingVars.push('GOOGLE_CLIENT_ID');
  if (!process.env.GOOGLE_CLIENT_SECRET) missingVars.push('GOOGLE_CLIENT_SECRET');

  res.status(200).json({
    environment: envCheck,
    missingVariables: missingVars,
    timestamp: new Date().toISOString(),
    recommendations: missingVars.length > 0 ? [
      'Set all required environment variables',
      'Ensure Google OAuth credentials are correct',
      'Check that NEXTAUTH_URL matches your domain',
      'Verify NEXTAUTH_SECRET is properly generated'
    ] : [
      'All required variables are set',
      'Check Google OAuth redirect URI configuration',
      'Verify domain settings in Google Cloud Console'
    ]
  });
} 