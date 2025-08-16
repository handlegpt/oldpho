import Head from 'next/head';

interface SEOOptimizerProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

// 安全的数据验证函数
const validateStructuredData = (data: any): object => {
  if (!data || typeof data !== 'object') {
    return {};
  }
  
  // 只允许安全的属性
  const safeProperties = [
    '@context', '@type', 'name', 'description', 'url', 
    'applicationCategory', 'operatingSystem', 'offers', 'creator'
  ];
  
  const sanitized: any = {};
  for (const key of safeProperties) {
    if (data[key] !== undefined) {
      // 确保值是字符串或对象，避免函数等危险类型
      if (typeof data[key] === 'string' || typeof data[key] === 'object') {
        sanitized[key] = data[key];
      }
    }
  }
  
  return sanitized;
};

// 安全的JSON序列化
const safeStringify = (obj: object): string => {
  try {
    // 使用JSON.stringify的安全版本
    return JSON.stringify(obj, (key, value) => {
      // 过滤掉函数和其他危险类型
      if (typeof value === 'function' || typeof value === 'symbol') {
        return undefined;
      }
      return value;
    });
  } catch (error) {
    console.error('JSON serialization error:', error);
    return '{}';
  }
};

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  title,
  description,
  keywords = 'AI photo restoration, photo enhancement, image repair, old photo restoration',
  image = '/og-image.jpg',
  url,
  type = 'website',
  structuredData
}) => {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Shin AI - AI Photo Restoration",
    "description": description,
    "url": fullUrl,
    "applicationCategory": "PhotoApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Shin AI"
    }
  };

  // 验证和清理结构化数据
  const validatedStructuredData = validateStructuredData(structuredData || defaultStructuredData);
  const safeJsonString = safeStringify(validatedStructuredData);

  return (
    <Head>
      {/* 基本元标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Shin AI" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 其他重要元标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Shin AI" />
      <link rel="canonical" href={fullUrl} />
      
      {/* 结构化数据 - 使用安全的JSON */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonString
        }}
      />
      
      {/* 预连接优化 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//upcdn.io" />
      <link rel="dns-prefetch" href="//replicate.delivery" />
    </Head>
  );
};

export default SEOOptimizer; 