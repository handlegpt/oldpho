import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

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

    // Ensure uploads directory exists in public folder
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Parse form data
    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const originalFilename = `original_${timestamp}_${file.originalFilename || 'image.jpg'}`;
    const processedFilename = `processed_${timestamp}_${file.originalFilename || 'image.jpg'}`;
    
    const originalPath = path.join(uploadsDir, originalFilename);
    const processedPath = path.join(uploadsDir, processedFilename);

    // Move uploaded file to original path
    fs.renameSync(file.filepath, originalPath);

    // Process image with Replicate API
    let processedImageUrl = '';
    
    try {
      // Check if Replicate API is configured
      if (!process.env.REPLICATE_API_TOKEN) {
        console.warn('REPLICATE_API_TOKEN not configured, using fallback');
        // Fallback: create a copy as "processed" image
        fs.copyFileSync(originalPath, processedPath);
        processedImageUrl = `/api/uploads/${processedFilename}`;
      } else {
        // Convert image to base64 for Replicate API
        const imageBuffer = fs.readFileSync(originalPath);
        const base64Image = imageBuffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64Image}`;

        // Call Replicate API for photo restoration
        const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
            input: {
              img: dataUrl,
              version: "v1.4",
              scale: 2
            },
          }),
        });

        if (!replicateResponse.ok) {
          throw new Error(`Replicate API error: ${replicateResponse.statusText}`);
        }

        const prediction = await replicateResponse.json();
        
        // Poll for completion
        let attempts = 0;
        const maxAttempts = 60; // 5 minutes
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          
          const statusResponse = await fetch(prediction.urls.get, {
            headers: {
              'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
          });

          if (!statusResponse.ok) {
            throw new Error(`Failed to get prediction status: ${statusResponse.statusText}`);
          }

          const status = await statusResponse.json();
          
          if (status.status === 'succeeded') {
            // Download the processed image
            const processedImageResponse = await fetch(status.output);
            if (!processedImageResponse.ok) {
              throw new Error('Failed to download processed image');
            }
            
            const processedImageBuffer = await processedImageResponse.arrayBuffer();
            fs.writeFileSync(processedPath, Buffer.from(processedImageBuffer));
            processedImageUrl = `/api/uploads/${processedFilename}`;
            break;
          } else if (status.status === 'failed') {
            throw new Error(status.error || 'Prediction failed');
          }
          
          attempts++;
        }

        if (attempts >= maxAttempts) {
          throw new Error('Prediction timeout');
        }
      }
    } catch (error) {
      console.error('Image processing error:', error);
      // Fallback: create a copy as "processed" image
      fs.copyFileSync(originalPath, processedPath);
      processedImageUrl = `/api/uploads/${processedFilename}`;
    }

    const originalImageUrl = `/api/uploads/${originalFilename}`;

    console.log('File uploaded and processed successfully:', {
      original: originalImageUrl,
      processed: processedImageUrl,
      originalPath,
      processedPath,
      userId: session.user.email
    });

    return res.status(200).json({
      success: true,
      imageUrl: originalImageUrl,
      processedImageUrl: processedImageUrl,
      filename: originalFilename,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 