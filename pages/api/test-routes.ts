import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Test available routes
  const routes = [
    '/',
    '/dashboard',
    '/settings',
    '/restore',
    '/pricing',
    '/help',
    '/auth/signin',
    '/auth/error',
    '/auth/verify-request'
  ];

  res.status(200).json({
    message: 'Route test endpoint',
    availableRoutes: routes,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
} 