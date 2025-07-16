import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const testFile = path.join(uploadsDir, 'test.txt');
    const testContent = 'This is a test file created at ' + new Date().toISOString();

    // Create test file
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    fs.writeFileSync(testFile, testContent);

    const testInfo = {
      uploadsDir,
      testFile,
      testFileExists: fs.existsSync(testFile),
      testFileContent: fs.readFileSync(testFile, 'utf8'),
      uploadsDirExists: fs.existsSync(uploadsDir),
      uploadsDirContents: fs.readdirSync(uploadsDir),
      cwd: process.cwd(),
      timestamp: new Date().toISOString()
    };

    return res.status(200).json(testInfo);

  } catch (error) {
    console.error('Test upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 