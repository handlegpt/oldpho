import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle uploads directory
  if (pathname.startsWith('/uploads/')) {
    try {
      // Construct the full file path
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = pathname.replace('/uploads/', '');
      const fullPath = path.join(uploadsDir, filePath);

      // Security check: ensure the path is within uploads directory
      const normalizedPath = path.normalize(fullPath);
      if (!normalizedPath.startsWith(uploadsDir)) {
        return new NextResponse('Access denied', { status: 403 });
      }

      // Check if file exists
      if (!fs.existsSync(normalizedPath)) {
        console.log('File not found in middleware:', normalizedPath);
        return new NextResponse('File not found', { status: 404 });
      }

      // Get file stats
      const stats = fs.statSync(normalizedPath);
      if (!stats.isFile()) {
        return new NextResponse('Not a file', { status: 400 });
      }

      // Read file
      const fileBuffer = fs.readFileSync(normalizedPath);
      
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
      
      const response = new NextResponse(fileBuffer);
      response.headers.set('Content-Type', contentType);
      response.headers.set('Content-Length', stats.size.toString());
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      response.headers.set('Last-Modified', stats.mtime.toUTCString());
      
      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      return new NextResponse('Internal server error', { status: 500 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/uploads/:path*',
};
