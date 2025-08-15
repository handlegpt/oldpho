import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('File serve API called');
    
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      console.log('File serve: Authentication failed');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('File serve: User authenticated:', session.user.email);

    // Get file path from query
    const { file } = req.query;
    
    if (!file || typeof file === 'string') {
      console.log('File serve: Invalid file parameter:', file);
      return res.status(400).json({ error: 'File path is required' });
    }

    // Join file path segments
    const filename = file.join('/');
    console.log('File serve: Requested filename:', filename);
    
    // Construct full file path
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, filename);

    console.log('File serve: File paths:', {
      uploadsDir,
      filePath,
      cwd: process.cwd()
    });

    // Security check: ensure file is within uploads directory
    const normalizedFilePath = path.normalize(filePath);
    const normalizedUploadsDir = path.normalize(uploadsDir);
    
    if (!normalizedFilePath.startsWith(normalizedUploadsDir)) {
      console.log('File serve: Access denied - path traversal attempt');
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File serve: File not found:', filePath);
      console.log('File serve: Uploads directory contents:', fs.readdirSync(uploadsDir));
      return res.status(404).json({ error: 'File not found' });
    }

    console.log('File serve: File found, serving:', filePath);

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    console.log('File serve: File served successfully');

  } catch (error) {
    console.error('File serve error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 