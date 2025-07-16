import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // For now, return a mock image URL since we don't have formidable
    // In production, you would implement proper file upload handling
    const timestamp = Date.now();
    const imageUrl = `/sample-image-${timestamp}.jpg`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Create a dummy file for demo purposes
    const dummyPath = path.join(uploadsDir, `sample-image-${timestamp}.jpg`);
    fs.writeFileSync(dummyPath, 'dummy image content');

    return res.status(200).json({
      success: true,
      imageUrl,
      filename: `sample-image-${timestamp}.jpg`,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 