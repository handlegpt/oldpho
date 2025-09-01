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
import MobileFAB from '../components/MobileFAB';
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
            <section className="text-center py-16 sm:py-24 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute top-20 right-1/4 w-64 h-64 bg-purple-100 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-100 rounded-full opacity-15 blur-3xl animate-pulse delay-2000"></div>
              </div>
              
              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-8 shadow-lg border border-blue-200/50">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                    <span>✨ AI-Powered Photo Restoration</span>
                    <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse delay-500"></span>
                  </div>
                </div>
                
                {/* Main Title */}
                <h1 className="text-responsive-xl font-bold text-gray-900 mb-8 leading-tight">
                  <span className="gradient-text">
                    {t.hero.title}
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-responsive text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in">
                  {t.hero.subtitle}
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  <button
                    onClick={handleGetStarted}
                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-6 px-12 rounded-2xl text-lg transition-medium shadow-strong hover:shadow-2xl transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 min-w-[200px] btn-hover-effect"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {t.hero.cta}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-3 bg-white text-gray-700 font-semibold py-6 px-10 rounded-2xl text-lg transition-medium shadow-medium hover:shadow-strong border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 min-w-[180px] card-hover"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>

                {/* Demo Section */}
                <div className="max-w-6xl mx-auto">
                  <div className="glass rounded-strong p-8 shadow-strong border border-white/50 animate-slide-up">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">See the Magic in Action</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Demo Card 1 */}
                      <div className="group relative overflow-hidden rounded-medium bg-gradient-to-br from-gray-50 to-gray-100 p-6 card-hover transition-medium">
                        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Face Restoration</h4>
                        <p className="text-gray-600 text-sm">Perfect for old portraits and family photos</p>
                      </div>

                      {/* Demo Card 2 */}
                      <div className="group relative overflow-hidden rounded-medium bg-gradient-to-br from-gray-50 to-gray-100 p-6 card-hover transition-medium">
                        <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-100 rounded-xl mb-4 flex items-center justify-center">
                          <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Photo Enhancement</h4>
                        <p className="text-gray-600 text-sm">Improve clarity and remove imperfections</p>
                      </div>

                      {/* Demo Card 3 */}
                      <div className="group relative overflow-hidden rounded-medium bg-gradient-to-br from-gray-50 to-gray-100 p-6 card-hover transition-medium">
                        <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl mb-4 flex items-center justify-center">
                          <svg className="w-16 h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2">Color Restoration</h4>
                        <p className="text-gray-600 text-sm">Bring life back to faded and damaged photos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 sm:py-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shin AI</span>?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experience the power of multiple AI models working together to deliver the best possible results
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatedCard>
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                    <p className="text-gray-600">Get your photos restored in seconds with our optimized AI models</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard>
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Quality</h3>
                    <p className="text-gray-600">Multiple AI models ensure the highest quality restoration results</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard>
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Private</h3>
                    <p className="text-gray-600">Your photos are processed securely and never stored permanently</p>
                  </div>
                </AnimatedCard>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-24 text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  Ready to Restore Your Memories?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of users who have already restored their precious photos
                </p>
                <button
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Start Restoring Now
                </button>
              </div>
            </section>
          </div>
        </main>

        <Footer />
        <MobileFAB />
      </div>

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
    </>
  );
};

export default Home;
