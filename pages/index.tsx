import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedCard from '../components/AnimatedCard';
import ShareModal from '../components/ShareModal';
import { SEO } from '../components/SEO';

const Home: NextPage = () => {
  const { currentLanguage } = useLanguage();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const router = useRouter();

  const t = translations[currentLanguage];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    // Use window.location.href for forced navigation
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
    <>
      <SEO 
        title={t.seo.title}
        description={t.seo.description}
        keywords={t.seo.keywords}
        language={currentLanguage}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <section className="text-center py-16 sm:py-24">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
                  <div className="absolute w-64 h-64 bg-purple-100 rounded-full opacity-20 blur-3xl -top-20 -right-20"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    AI-Powered Photo Restoration
                  </div>
                  
                  <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-8 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t.hero.title}
                  </h1>
                  
                  <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                    {t.hero.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={handleGetStarted}
                      className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-5 px-10 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                    >
                      <span className="relative z-10">{t.hero.cta}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 bg-white text-gray-700 font-semibold py-5 px-8 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimatedCard className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                    <div className="text-gray-600 font-medium">{t.stats.photos}</div>
                  </div>
                </AnimatedCard>
                <AnimatedCard className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                    <div className="text-gray-600 font-medium">{t.stats.satisfaction}</div>
                  </div>
                </AnimatedCard>
                <AnimatedCard className="bg-white/80 backdrop-blur-sm border border-gray-200/50">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                      </svg>
                    </div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-gray-600 font-medium">{t.stats.support}</div>
                  </div>
                </AnimatedCard>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  {t.features.title}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.features.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {t.features.items.map((feature, index) => (
                  <AnimatedCard key={index} className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-200 transition-all duration-300">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-3xl">{feature.icon}</div>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t.howItWorks.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.howItWorks.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {t.howItWorks.steps.map((step, index) => (
                  <AnimatedCard key={index}>
                    <div className="text-center p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-4">{index + 1}</div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </section>

            {/* Before/After Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t.beforeAfter.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.beforeAfter.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatedCard>
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-semibold mb-4">{t.beforeAfter.before}</h3>
                    <div className="bg-gray-200 h-64 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-500">Before Image</span>
                    </div>
                  </div>
                </AnimatedCard>
                <AnimatedCard>
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-semibold mb-4">{t.beforeAfter.after}</h3>
                    <div className="bg-blue-100 h-64 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-blue-600">After Image</span>
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </section>

            {/* Trust Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t.trust.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.trust.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {t.trust.items.map((item, index) => (
                  <AnimatedCard key={index}>
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {t.finalCta.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {t.finalCta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {t.finalCta.button}
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
                >
                  Share
                </button>
              </div>
            </section>
          </div>
        </main>

        <Footer />

        {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            shareData={{
              title: t.share.title,
              description: t.share.description,
              url: typeof window !== 'undefined' ? window.location.href : ''
            }}
            currentLanguage={currentLanguage}
          />
        )}
      </div>
    </>
  );
};

export default Home;
