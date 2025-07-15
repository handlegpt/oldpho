import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOOptimizer from '../components/SEOOptimizer';
import PerformanceMonitor from '../components/PerformanceMonitor';
import PerformanceOptimizer from '../components/PerformanceOptimizer';
import JankDetector from '../components/JankDetector';
import { Language, translations } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Testimonials } from '../components/Testimonials';
import ShareModal from '../components/ShareModal';
import ShareButton from '../components/ShareButton';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const router = useRouter();

  const t = translations[currentLanguage];

  useEffect(() => {
    setIsClient(true);
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  const handleGetStarted = () => {
    // 使用 window.location.href 进行强制跳转
    if (typeof window !== 'undefined') {
      window.location.href = '/restore';
    }
  };

  const handleShare = () => {
    if (isClient && navigator.share) {
      navigator.share({
        title: t.share.title,
        text: t.share.description,
        url: window.location.href
      }).catch(() => {
        setShowShareModal(true);
      });
    } else {
      setShowShareModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>{t.seo.title}</title>
        <meta name="description" content={t.seo.description} />
        <meta name="keywords" content={t.seo.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="OldPho" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t.seo.title} />
        <meta property="og:description" content={t.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://oldpho.com" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:site_name" content="OldPho" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.seo.title} />
        <meta name="twitter:description" content={t.seo.description} />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "OldPho",
              "description": t.seo.description,
              "url": "https://oldpho.com",
              "applicationCategory": "PhotoApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        
        {/* 预加载关键资源 */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//upcdn.io" />
        <link rel="dns-prefetch" href="//replicate.delivery" />
      </Head>
      <SEOOptimizer
        title={t.seo.title}
        description={t.seo.description}
        keywords={t.seo.keywords}
        image="/og-image.jpg"
        url={isClient ? window.location.href : ''}
      />
      <PerformanceMonitor />
      <PerformanceOptimizer />
      <JankDetector />
      
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                {t.hero.title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                {t.hero.subtitle}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-colors duration-150 transform hover:scale-105 shadow-xl hover:shadow-2xl active:scale-95 touch-manipulation min-h-[48px] min-w-[120px]"
              >
                {t.hero.cta}
              </button>
              <ShareButton
                onClick={handleShare}
                currentLanguage={currentLanguage}
                className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-150 transform hover:scale-105 shadow-xl touch-manipulation min-h-[48px] min-w-[120px]"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
              <AnimatedCard className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">10M+</div>
                <div className="text-sm sm:text-base text-gray-600">{t.stats.photos}</div>
              </AnimatedCard>
              <AnimatedCard className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-sm sm:text-base text-gray-600">{t.stats.satisfaction}</div>
              </AnimatedCard>
              <AnimatedCard className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-pink-600 mb-2">24/7</div>
                <div className="text-sm sm:text-base text-gray-600">{t.stats.support}</div>
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t.features.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {t.features.items.map((feature, index) => (
                <AnimatedCard key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <div className="text-white text-xl sm:text-2xl">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t.howItWorks.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t.howItWorks.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {t.howItWorks.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6 sm:mb-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-xl sm:text-2xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                    {index < t.howItWorks.steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 sm:top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 leading-tight">{step.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t.beforeAfter.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t.beforeAfter.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              {t.beforeAfter.examples.map((example, index) => (
                <AnimatedCard key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">{t.beforeAfter.before}</h4>
                      <div className="relative bg-gray-200 rounded-lg h-28 sm:h-32 md:h-48 overflow-hidden shadow-inner">
                        <Image
                          src={index === 0 ? "/images/family-portrait-before.jpg" : "/images/historical-photo-before.jpg"}
                          alt="Before restoration"
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">{t.beforeAfter.after}</h4>
                      <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-28 sm:h-32 md:h-48 overflow-hidden shadow-inner">
                        <Image
                          src={index === 0 ? "/images/family-portrait-after.jpg" : "/images/historical-photo-after.jpg"}
                          alt="After restoration"
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">{example.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{example.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {t.trust.title}
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t.trust.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {t.trust.items.map((item, index) => (
                <AnimatedCard key={index} className="text-center p-5 sm:p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="text-white text-xl sm:text-2xl">{item.icon}</div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials currentLanguage={currentLanguage} />

        {/* Final CTA */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t.finalCta.title}
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
              {t.finalCta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors duration-150 transform hover:scale-105 shadow-xl touch-manipulation min-h-[48px] min-w-[120px]"
              >
                {t.finalCta.button}
              </button>
              <Link
                href="/pricing"
                className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-colors duration-150 transform hover:scale-105 shadow-xl touch-manipulation min-h-[48px] min-w-[120px]"
              >
                {currentLanguage === 'zh-TW' ? '查看价格计划' : currentLanguage === 'ja' ? '料金プランを見る' : 'View Pricing Plans'}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={{
          title: t.share.title,
          description: t.share.description,
          url: isClient ? window.location.href : '',
          imageUrl: '/og-image.jpg'
        }}
        currentLanguage={currentLanguage}
      />
    </div>
  );
};

export default Home;
