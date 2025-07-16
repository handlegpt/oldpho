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
            <section className="text-center py-12 sm:py-20">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t.hero.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                {t.hero.subtitle}
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t.hero.cta}
              </button>
            </section>

            {/* Stats Section */}
            <section className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimatedCard>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                    <div className="text-gray-600">{t.stats.photos}</div>
                  </div>
                </AnimatedCard>
                <AnimatedCard>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
                    <div className="text-gray-600">{t.stats.satisfaction}</div>
                  </div>
                </AnimatedCard>
                <AnimatedCard>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                    <div className="text-gray-600">{t.stats.support}</div>
                  </div>
                </AnimatedCard>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t.features.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.features.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {t.features.items.map((feature, index) => (
                  <AnimatedCard key={index}>
                    <div className="text-center p-6">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
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
            onClose={() => setShowShareModal(false)}
            title={t.share.title}
            description={t.share.description}
            url={typeof window !== 'undefined' ? window.location.href : ''}
          />
        )}
      </div>
    </>
  );
};

export default Home;
