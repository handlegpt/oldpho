import { Ratelimit } from '@upstash/ratelimit';
import { NextApiRequest, NextApiResponse } from 'next';
import redis from '../../utils/redis';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prisma from '../../lib/prismadb';

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }

  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json('Login to upload.');
  }

  // Validate input
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json('Image URL is required');
  }

  try {
    // Get user's subscription
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { subscription: true }
    });

    if (!user) {
      return res.status(404).json('User not found');
    }

    // Determine rate limit based on subscription
    let rateLimit: number;
    let isFreeUser = true;

    if (user.subscription && user.subscription.status === 'active') {
      switch (user.subscription.planId) {
        case 'pro':
          rateLimit = 50;
          isFreeUser = false;
          break;
        case 'enterprise':
          rateLimit = -1; // Unlimited
          isFreeUser = false;
          break;
        default:
          rateLimit = 5;
          isFreeUser = true;
      }
    } else {
      rateLimit = 5; // Free plan
      isFreeUser = true;
    }

    // Rate Limiting by user email
    if (redis && rateLimit !== -1) {
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(rateLimit, '43200 m'), // 30 days
      });

      const identifier = session.user.email;
      const result = await ratelimit.limit(identifier!);
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);

      // Calculate the remaining time until generations are reset
      const diff = Math.abs(
        new Date(result.reset).getTime() - new Date().getTime()
      );
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor(diff / 1000 / 60) - hours * 60;

      if (!result.success) {
        return res
          .status(429)
          .json(
            `Your generations will renew in ${hours} hours and ${minutes} minutes. Please try again later.`
          );
      }
    }

    // Check if Replicate API key is configured
    if (!process.env.REPLICATE_API_KEY) {
      return res.status(500).json('Replicate API key not configured');
    }

    // POST request to Replicate to start the image restoration generation process
    let startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + process.env.REPLICATE_API_KEY,
      },
      body: JSON.stringify({
        version:
          '9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3',
        input: { img: imageUrl, version: 'v1.4', scale: 2 },
      }),
    });

    if (!startResponse.ok) {
      const errorData = await startResponse.json();
      console.error('Replicate API error:', errorData);
      return res.status(startResponse.status).json(`Replicate API error: ${errorData.detail || 'Unknown error'}`);
    }

    let jsonStartResponse = await startResponse.json();
    let endpointUrl = jsonStartResponse.urls.get;

    if (!endpointUrl) {
      return res.status(500).json('Failed to get prediction endpoint');
    }

    // GET request to get the status of the image restoration process & return the result when it's ready
    let restoredImage: string | null = null;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds timeout

    while (!restoredImage && attempts < maxAttempts) {
      attempts++;
      console.log(`polling for result... attempt ${attempts}`);
      
      let finalResponse = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + process.env.REPLICATE_API_KEY,
        },
      });

      if (!finalResponse.ok) {
        const errorData = await finalResponse.json();
        console.error('Replicate polling error:', errorData);
        return res.status(finalResponse.status).json(`Replicate polling error: ${errorData.detail || 'Unknown error'}`);
      }

      let jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === 'succeeded') {
        restoredImage = jsonFinalResponse.output;
      } else if (jsonFinalResponse.status === 'failed') {
        console.error('Replicate processing failed:', jsonFinalResponse);
        return res.status(500).json('Image restoration failed');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!restoredImage) {
      return res.status(408).json('Image restoration timed out');
    }

    // 根据用户订阅计划决定是否添加水印
    const responseData = {
      imageUrl: restoredImage,
      hasWatermark: isFreeUser,
      isFreeUser: isFreeUser
    };

    res.status(200).json(JSON.stringify(responseData));
  } catch (error) {
    console.error('Generate API error:', error);
    res.status(500).json('Internal server error');
  }
}
