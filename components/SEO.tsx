import Head from 'next/head';
import { Language } from '../utils/translations';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  language?: Language;
  structuredData?: any;
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'OldPho - AI Photo Restoration',
  description = 'Restore old and blurry face photos using AI technology. Free photo restoration service.',
  keywords = 'photo restoration, AI photo restoration, old photo restoration, blurry photo fix, free photo restoration',
  ogImage = '/og-image.jpg',
  canonical,
  language = 'en',
  structuredData,
  noindex = false
}) => {
  const fullTitle = title === 'OldPho - AI Photo Restoration' ? title : `${title} | OldPho`;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      
      {/* 语言设置 */}
      <meta httpEquiv="content-language" content={language === 'zh-TW' ? 'zh-TW' : language === 'ja' ? 'ja' : 'en'} />
      
      {/* 搜索引擎优化 */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={language === 'zh-TW' ? 'zh_TW' : language === 'ja' ? 'ja_JP' : 'en_US'} />
      <meta property="og:site_name" content="OldPho" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://replicate.com" />
      
      {/* 结构化数据 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* 安全头 */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="theme-color" content="#3B82F6" />
    </Head>
  );
}; 