export const replicate = {
  run: async (model: string, options: any) => {
    try {
      // Check if REPLICATE_API_TOKEN or REPLICATE_API_KEY is configured
      const apiToken = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY;
      console.log('API Token configured:', !!apiToken);
      console.log('Model:', model);
      console.log('Options:', JSON.stringify(options, null, 2));
      
      if (!apiToken) {
        console.warn('REPLICATE_API_TOKEN/REPLICATE_API_KEY not configured, using mock response');
        return options.input.img;
      }

      // Call Replicate API
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: model,
          input: options.input,
        }),
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        const statusResponse = await fetch(prediction.urls.get, {
          headers: {
            'Authorization': `Token ${apiToken}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to get prediction status: ${statusResponse.statusText}`);
        }

        const status = await statusResponse.json();
        
        if (status.status === 'succeeded') {
          return status.output;
        } else if (status.status === 'failed') {
          throw new Error(status.error || 'Prediction failed');
        }
        
        attempts++;
      }

      throw new Error('Prediction timeout');

    } catch (error) {
      console.error('Replicate API error:', error);
      
      // Fallback: return original image if API fails
      console.warn('Using fallback: returning original image');
      return options.input.img;
    }
  }
}; 