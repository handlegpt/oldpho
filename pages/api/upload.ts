import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';

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

    // For now, create a simple processed image (in real app, this would call AI service)
    // TODO: Integrate with Replicate API for actual image restoration
    const testImageData = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
      0x00, 0xFF, 0xD9
    ]);

    fs.writeFileSync(processedPath, testImageData);

    // Save restoration record to database
    const startTime = Date.now();
    const restoration = await prisma.restoration.create({
      data: {
        userId: session.user.email!,
        originalImage: `/uploads/${originalFilename}`,
        restoredImage: `/uploads/${processedFilename}`,
        status: 'completed',
        processingTime: Date.now() - startTime,
      },
    });

    console.log('Restoration record created:', restoration);

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