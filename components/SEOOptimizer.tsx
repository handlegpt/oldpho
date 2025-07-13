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
    "name": "OldPho - AI Photo Restoration",
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
      "name": "OldPho"
    }
  };

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
      <meta property="og:site_name" content="OldPho" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 其他重要元标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="OldPho" />
      <link rel="canonical" href={fullUrl} />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData || defaultStructuredData)
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