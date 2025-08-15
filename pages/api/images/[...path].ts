import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path: filePath } = req.query;
    
    if (!filePath || !Array.isArray(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    // Construct the full file path
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const fullPath = path.join(uploadsDir, ...filePath);

    // Security check: ensure the path is within uploads directory
    const normalizedPath = path.normalize(fullPath);
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      console.log('Image not found:', normalizedPath);
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get file stats
    const stats = fs.statSync(normalizedPath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Not a file' });
    }

    // Set appropriate headers
    const ext = path.extname(normalizedPath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // Stream the file
    const fileStream = fs.createReadStream(normalizedPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Image serving error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path: filePath } = req.query;
    
    if (!filePath || !Array.isArray(filePath)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    // Construct the full file path
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const fullPath = path.join(uploadsDir, ...filePath);

    // Security check: ensure the path is within uploads directory
    const normalizedPath = path.normalize(fullPath);
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      console.log('Image not found:', normalizedPath);
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get file stats
    const stats = fs.statSync(normalizedPath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Not a file' });
    }

    // Set appropriate headers
    const ext = path.extname(normalizedPath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // Stream the file
    const fileStream = fs.createReadStream(normalizedPath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Image serving error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
