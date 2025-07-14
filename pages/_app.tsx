import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useEffect, useState } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  // 全局错误处理
  useEffect(() => {
    setIsClient(true);
    
    const handleError = (error: ErrorEvent) => {
      console.error('Global error:', error);
      // 这里可以添加错误上报逻辑
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // 这里可以添加错误上报逻辑
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // PWA 安装提示 - 延迟加载
  useEffect(() => {
    if (!isClient) return;

    // 延迟加载 Service Worker
    const loadServiceWorker = async () => {
      if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered: ', registration);
        } catch (registrationError) {
          console.log('SW registration failed: ', registrationError);
        }
      }
    };

    // 延迟1秒后加载Service Worker
    const timer = setTimeout(loadServiceWorker, 1000);
    return () => clearTimeout(timer);
  }, [isClient]);

  // 性能监控
  useEffect(() => {
    if (!isClient) return;

    // 监控页面加载性能
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('页面加载时间:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            total: navEntry.loadEventEnd - navEntry.fetchStart
          });
        }
      }
    });

    observer.observe({ entryTypes: ['navigation'] });

    return () => observer.disconnect();
  }, [isClient]);

  return (
    <ErrorBoundary>
      <Head>
        {/* PWA 相关元标签 */}
        <meta name="application-name" content="OldPho" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OldPho" />
        <meta name="description" content="AI-powered photo restoration tool" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />

        {/* PWA 图标 */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* 预加载关键资源 */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//upcdn.io" />
        <link rel="dns-prefetch" href="//replicate.delivery" />
        
        {/* 性能优化 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upcdn.io" />
        <link rel="preconnect" href="https://replicate.delivery" />
      </Head>
      <SessionProvider session={session}>
        <PlausibleProvider domain='oldpho.com'>
          <Component {...pageProps} />
        </PlausibleProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
