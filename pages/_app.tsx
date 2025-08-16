import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import PlausibleProvider from 'next-plausible';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LanguageProvider } from '../contexts/LanguageContext';
import { useEffect, useState } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  // Global error handling
  useEffect(() => {
    setIsClient(true);
    
    const handleError = (error: ErrorEvent) => {
      console.error('Global error:', error);
      // Add error reporting logic here
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Add error reporting logic here
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // PWA install prompt - lazy load
  useEffect(() => {
    if (!isClient) return;

    // Lazy load Service Worker
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

    // Load Service Worker after 1 second delay
    const timer = setTimeout(loadServiceWorker, 1000);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Performance monitoring
  useEffect(() => {
    if (!isClient) return;

    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log('Page load time:', {
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
        {/* PWA related meta tags */}
        <meta name="application-name" content="Shin AI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Shin AI" />
        <meta name="description" content="AI-powered photo restoration tool" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />

        {/* PWA icons - using favicon only */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upcdn.io" />
        <link rel="preconnect" href="https://replicate.delivery" />
      </Head>
      <SessionProvider session={session}>
        <PlausibleProvider domain='shinai.com'>
          <LanguageProvider>
            <Component {...pageProps} />
          </LanguageProvider>
        </PlausibleProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
