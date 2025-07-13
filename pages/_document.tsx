import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='zh-CN'>
        <Head>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='description'
            content='使用 AI 技术修复老照片和模糊的人像照片。免费的照片修复服务，每月可修复5张照片。'
          />
          <meta name='keywords' content='AI照片修复,老照片修复,模糊照片修复,人像修复,照片增强' />
          <meta name='author' content='OldPho' />
          <meta name='robots' content='index, follow' />
          
          {/* Open Graph */}
          <meta property='og:site_name' content='OldPho' />
          <meta
            property='og:description'
            content='使用 AI 技术修复老照片和模糊的人像照片。免费的照片修复服务。'
          />
          <meta property='og:title' content='OldPho - AI Photo Restoration' />
          <meta property='og:type' content='website' />
          <meta property='og:locale' content='zh_CN' />
          
          {/* Twitter */}
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content='OldPho - AI Photo Restoration' />
          <meta
            name='twitter:description'
            content='使用 AI 技术修复老照片和模糊的人像照片。'
          />
          
          {/* 图片链接需要更新为实际的 og-image */}
          <meta
            property='og:image'
            content='https://oldpho.com/og-image.png'
          />
          <meta
            name='twitter:image'
            content='https://oldpho.com/og-image.png'
          />
          
          {/* 预连接优化 */}
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
          
          {/* 安全头 */}
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
