import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import { replicate } from '../../lib/replicate';

const prisma = new PrismaClient();

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
    console.log('Upload API called');
    
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      console.log('Authentication failed');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('User authenticated:', session.user.email);

    // Ensure uploads directory exists in public folder
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create directory with proper permissions
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
        console.log('Created uploads directory:', uploadsDir);
      }
      
      // Ensure directory is writable
      fs.accessSync(uploadsDir, fs.constants.W_OK);
      console.log('Uploads directory is writable');
    } catch (dirError) {
      console.error('Directory creation/access error:', dirError);
      return res.status(500).json({ 
        error: 'Failed to create or access uploads directory',
        message: dirError instanceof Error ? dirError.message : 'Unknown directory error'
      });
    }

    // Parse the uploaded file
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    const [fields, files] = await form.parse(req);
    const uploadedFile = files.image?.[0]; // Assuming the field name is 'image'

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    console.log('File uploaded:', uploadedFile);

    // Generate unique filenames
    const timestamp = Date.now();
    const originalFilename = `original_${timestamp}_${path.basename(uploadedFile.originalFilename || 'image.jpg')}`;
    const processedFilename = `processed_${timestamp}_${path.basename(uploadedFile.originalFilename || 'image.jpg')}`;
    
    const originalPath = path.join(uploadsDir, originalFilename);
    const processedPath = path.join(uploadsDir, processedFilename);

    // Move uploaded file to final location
    fs.renameSync(uploadedFile.filepath, originalPath);

    // Create restoration record with processing status
    const startTime = Date.now();
    const restoration = await prisma.restoration.create({
      data: {
        userId: session.user.email!,
        originalImage: `/uploads/${originalFilename}`,
        restoredImage: `/uploads/${processedFilename}`,
        status: 'processing',
        processingTime: null,
      },
    });

    console.log('Restoration record created:', restoration);

    try {
      // Call Replicate API for AI image restoration
      console.log('Calling Replicate API for image restoration...');
      
      const result = await replicate.run(
        "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        {
          input: {
            img: originalPath,
            version: "v1.4",
            scale: 2
          }
        }
      );

      // Download the restored image from Replicate
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
      } else {
        // Fallback: create a copy of original image
        console.log('Using fallback: copying original image');
        fs.copyFileSync(originalPath, processedPath);
      }

      // Update restoration record with success
      const processingTime = Date.now() - startTime;
      await prisma.restoration.update({
        where: { id: restoration.id },
        data: {
          status: 'completed',
          processingTime,
        },
      });

      console.log('Restoration completed successfully');

    } catch (aiError) {
      console.error('AI processing error:', aiError);
      
      // Create a fallback processed image
      fs.copyFileSync(originalPath, processedPath);
      
      // Update restoration record with error
      const processingTime = Date.now() - startTime;
      await prisma.restoration.update({
        where: { id: restoration.id },
        data: {
          status: 'failed',
          processingTime,
        },
      });

      console.log('Using fallback due to AI processing error');
    }

    const originalImageUrl = `/uploads/${originalFilename}`;
    const processedImageUrl = `/uploads/${processedFilename}`;

    console.log('File uploaded and processed successfully:', {
      original: originalImageUrl,
      processed: processedImageUrl,
      originalPath,
      processedPath,
      userId: session.user.email,
      restorationId: restoration.id
    });

    return res.status(200).json({
      success: true,
      imageUrl: originalImageUrl,
      processedImageUrl: processedImageUrl,
      filename: originalFilename,
      restorationId: restoration.id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 