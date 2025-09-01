import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { geminiClient } from '../../lib/gemini';

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

    const { imageData, prompt } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GOOGLE_GEMINI_API_KEY not configured' });
    }

    console.log('Testing Gemini 2.5 Flash API...');

    // Test image enhancement
    const enhancedImage = await geminiClient.enhanceImage(
      imageData, 
      prompt || "请修复这张照片，提高清晰度，去除噪点，增强细节。保持原始构图和风格，只进行质量提升。"
    );

    // Test image analysis
    const analysis = await geminiClient.analyzeImage(
      imageData,
      "请分析这张照片的内容，包括主要对象、场景、颜色、质量等方面。"
    );

    return res.status(200).json({
      success: true,
      enhancedImage,
      analysis,
      message: 'Gemini 2.5 Flash API 测试成功'
    });

  } catch (error) {
    console.error('Gemini API test error:', error);
    return res.status(500).json({
      error: 'Gemini API test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
