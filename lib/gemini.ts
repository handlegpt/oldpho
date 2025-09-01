// Google Gemini 2.5 Flash API 客户端
export class GeminiClient {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async enhanceImage(imageData: string, prompt: string = "请修复这张照片，提高清晰度，去除噪点，增强细节。保持原始构图和风格，只进行质量提升。"): Promise<string> {
    try {
      console.log('调用 Google Gemini 2.5 Flash API 进行图像增强...');
      
      // 移除 data:image/jpeg;base64, 前缀
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const response = await fetch(`${this.baseUrl}/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API 错误:', errorText);
        throw new Error(`Gemini API 错误: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Gemini API 响应:', result);

      // 检查是否有生成的图像
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const content = result.candidates[0].content;
        
        // 查找图像数据
        for (const part of content.parts) {
          if (part.inline_data && part.inline_data.mime_type.startsWith('image/')) {
            return `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
          }
        }
      }

      // 如果没有返回图像，返回原始图像
      console.warn('Gemini API 未返回图像，使用原始图像');
      return imageData;

    } catch (error) {
      console.error('Gemini API 处理错误:', error);
      throw error;
    }
  }

  async analyzeImage(imageData: string, prompt: string): Promise<string> {
    try {
      console.log('调用 Google Gemini 2.5 Flash API 进行图像分析...');
      
      // 移除 data:image/jpeg;base64, 前缀
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const response = await fetch(`${this.baseUrl}/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API 错误:', errorText);
        throw new Error(`Gemini API 错误: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Gemini API 分析响应:', result);

      // 返回文本响应
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const content = result.candidates[0].content;
        
        // 查找文本响应
        for (const part of content.parts) {
          if (part.text) {
            return part.text;
          }
        }
      }

      return '无法分析图像';

    } catch (error) {
      console.error('Gemini API 分析错误:', error);
      throw error;
    }
  }
}

// 创建默认实例
export const geminiClient = new GeminiClient(process.env.GOOGLE_GEMINI_API_KEY || '');
