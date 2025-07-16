// Image enhancement utilities using Canvas API
export class ImageEnhancer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // Enhance image sharpness and quality
  async enhanceImage(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Set canvas size to 2x the original for better quality
          const width = img.width * 2;
          const height = img.height * 2;
          
          this.canvas.width = width;
          this.canvas.height = height;

          // Apply image smoothing for better quality
          this.ctx.imageSmoothingEnabled = true;
          this.ctx.imageSmoothingQuality = 'high';

          // Draw the image at 2x size
          this.ctx.drawImage(img, 0, 0, width, height);

          // Apply sharpening filter
          this.applySharpeningFilter();

          // Apply contrast enhancement
          this.applyContrastEnhancement();

          // Apply brightness adjustment
          this.applyBrightnessAdjustment();

          // Convert to base64
          const enhancedImageUrl = this.canvas.toDataURL('image/jpeg', 0.95);
          resolve(enhancedImageUrl);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  }

  // Apply sharpening filter
  private applySharpeningFilter() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    // Sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const newData = new Uint8ClampedArray(data.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * kernel[kernelIdx];
            }
          }
          const idx = (y * width + x) * 4 + c;
          newData[idx] = Math.max(0, Math.min(255, sum));
        }
        // Keep alpha channel unchanged
        const idx = (y * width + x) * 4 + 3;
        newData[idx] = data[idx];
      }
    }

    imageData.data.set(newData);
    this.ctx.putImageData(imageData, 0, 0);
  }

  // Apply contrast enhancement
  private applyContrastEnhancement() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const factor = 1.2; // Contrast factor

    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast to RGB channels
      for (let j = 0; j < 3; j++) {
        data[i + j] = Math.max(0, Math.min(255, 
          ((data[i + j] - 128) * factor) + 128
        ));
      }
      // Keep alpha channel unchanged
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  // Apply brightness adjustment
  private applyBrightnessAdjustment() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const brightness = 10; // Brightness adjustment

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness to RGB channels
      for (let j = 0; j < 3; j++) {
        data[i + j] = Math.max(0, Math.min(255, data[i + j] + brightness));
      }
      // Keep alpha channel unchanged
    }

    this.ctx.putImageData(imageData, 0, 0);
  }
}

// Export a simple function for easy use
export const enhanceImage = async (imageUrl: string): Promise<string> => {
  const enhancer = new ImageEnhancer();
  return enhancer.enhanceImage(imageUrl);
}; 