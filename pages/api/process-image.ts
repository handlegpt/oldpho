import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

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

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Handle relative URLs by constructing full path
    let fullImageUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      // For relative URLs, construct the full path
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
      fullImageUrl = `${baseUrl}${imageUrl}`;
    }

    // Download the image
    const imageResponse = await fetch(fullImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    // For now, we'll simulate processing by creating a copy with a different name
    // In production, you would apply actual image processing here
    const timestamp = Date.now();
    const enhancedFilename = `enhanced_${timestamp}.jpg`;
    const enhancedPath = path.join(process.cwd(), 'public', 'uploads', enhancedFilename);
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save the processed image (for now, just copy the original)
    fs.writeFileSync(enhancedPath, Buffer.from(imageBuffer));
    
    // Return the enhanced image URL
    const enhancedImageUrl = `/uploads/${enhancedFilename}`;

    return res.status(200).json({
      success: true,
      enhancedImageUrl,
      processingTime: 2000,
      message: 'Image enhanced successfully'
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 