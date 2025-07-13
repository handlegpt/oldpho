// 水印工具函数
export const addWatermark = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 设置画布尺寸
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // 绘制原图
      ctx.drawImage(img, 0, 0);
      
      // 添加水印
      ctx.font = '24px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 2;
      
      const text = 'OldPho';
      const x = img.width - 120;
      const y = img.height - 20;
      
      // 绘制文字描边
      ctx.strokeText(text, x, y);
      // 绘制文字
      ctx.fillText(text, x, y);
      
      // 转换为 base64
      const watermarkedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(watermarkedImageUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

// 检查是否为免费用户
export const isFreeUser = (userPlan: string | null): boolean => {
  return !userPlan || userPlan === 'free';
}; 