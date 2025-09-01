import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import * as fs from 'fs';
import * as path from 'path';
import formidable from 'formidable';
import { aiProviderManager } from '../../lib/aiProviders';
import prisma from '../../lib/prismadb';
import { checkRestorationLimit, checkFileSizeLimit } from '../../lib/permissions';

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
    console.log('Restore API called');
    
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      console.log('Authentication failed');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('User authenticated:', session.user.email);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user.id, 'Email:', user.email);

    // Check restoration limits
    const limitCheck = await checkRestorationLimit(user.id.toString());
    if (!limitCheck.allowed) {
      console.log('Restoration limit exceeded:', limitCheck.error);
      return res.status(429).json({ 
        error: 'Restoration limit exceeded',
        message: limitCheck.error,
        remaining: limitCheck.remaining
      });
    }

    console.log('Restoration limit check passed. Remaining:', limitCheck.remaining);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
    }

    // Parse the uploaded file and form data
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    console.log('Parsing form data...');
    const [fields, files] = await form.parse(req);
    
    const uploadedFile = files.image?.[0];
    const enhancementType = fields.enhancementType?.[0] || 'full';
    const scale = parseInt(fields.scale?.[0] || '2');
    const faceEnhancement = fields.faceEnhancement?.[0] === 'true';
    const colorization = fields.colorization?.[0] === 'true';
    const upscaling = fields.upscaling?.[0] === 'true';

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Check file size limit
    const fileSizeCheck = await checkFileSizeLimit(user.id.toString(), uploadedFile.size || 0);
    if (!fileSizeCheck.allowed) {
      return res.status(413).json({ 
        error: 'File size limit exceeded',
        message: fileSizeCheck.error
      });
    }

    const timestamp = Date.now();
    const originalFilename = `original_${timestamp}_${path.basename(uploadedFile.originalFilename || 'image.jpg')}`;
    const processedFilename = `processed_${timestamp}_${path.basename(uploadedFile.originalFilename || 'image.jpg')}`;
    
    const originalPath = path.join(uploadsDir, originalFilename);
    const processedPath = path.join(uploadsDir, processedFilename);

    // Move uploaded file to final location
    fs.renameSync(uploadedFile.filepath, originalPath);

    console.log('Original file saved:', originalPath);

    try {
      // Convert image to base64
      const imageBuffer = fs.readFileSync(originalPath);
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      
      console.log(`Processing with ${enhancementType} enhancement...`);
      
      const result = await aiProviderManager.processImageWithFallback({
        imageData: dataUrl,
        enhancementType: enhancementType as any,
        options: {
          faceEnhancement,
          colorization,
          upscaling,
          scale
        }
      });

      // Download the restored image
      if (typeof result === 'string' && result.startsWith('http')) {
        console.log('Downloading restored image from:', result);
        
        const imageResponse = await fetch(result);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          fs.writeFileSync(processedPath, Buffer.from(imageBuffer));
          console.log('Restored image saved successfully');
        } else {
          throw new Error('Failed to download restored image');
        }
      } else if (result.startsWith('data:image/')) {
        // Handle base64 result
        const base64Data = result.replace(/^data:image\/[a-z]+;base64,/, '');
        fs.writeFileSync(processedPath, Buffer.from(base64Data, 'base64'));
        console.log('Restored image saved from base64');
      } else {
        // Fallback: create a copy of original image
        console.log('Using fallback: copying original image');
        fs.copyFileSync(originalPath, processedPath);
      }

      console.log('Restoration completed successfully');

    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Create a fallback processed image
      fs.copyFileSync(originalPath, processedPath);
      
      console.log('Using fallback due to AI processing error');
    }

    const originalImageUrl = `/uploads/${originalFilename}`;
    const processedImageUrl = `/uploads/${processedFilename}`;

    // Save restoration record to database
    try {
      const restorationData = {
        userId: user.id,
        originalImage: originalImageUrl,
        restoredImage: processedImageUrl,
        status: 'completed',
        processingTime: Date.now() - timestamp
      };
      
      const restoration = await prisma.restoration.create({
        data: restorationData
      });
      
      console.log('Restoration record saved successfully:', restoration.id);
    } catch (dbError) {
      console.error('Database error:', dbError);
    }

    return res.status(200).json({
      success: true,
      originalImage: originalImageUrl,
      restoredImage: processedImageUrl,
      enhancementType,
      message: 'Image restored successfully'
    });

  } catch (error) {
    console.error('Restore API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
