import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubscriptionPlans from '../components/SubscriptionPlans';
import Toast from '../components/Toast';
import { useLanguage } from '../contexts/LanguageContext';

const Subscription: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLanguageChange = (language: string) => {
    // Language change is now handled by the global context
    console.log('Language changed to:', language);
  };

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      setToast({
        type: 'error',
        message: currentLanguage === 'zh-TW' 
          ? '请先登录' 
          : currentLanguage === 'ja' 
          ? 'ログインしてください'
          : 'Please login first'
      });
      return;
    }

    try {
      // Integrate payment system here, such as Stripe
      setToast({
        type: 'success',
        message: currentLanguage === 'zh-TW' 
          ? '正在跳转到支付页面...' 
          : currentLanguage === 'ja' 
          ? '決済ページに移動中...'
          : 'Redirecting to payment...'
      });

      // Simulate payment process
      setTimeout(() => {
        setToast({
          type: 'success',
          message: currentLanguage === 'zh-TW' 
            ? '订阅成功！' 
            : currentLanguage === 'ja' 
            ? 'サブスクリプション成功！'
            : 'Subscription successful!'
        });
      }, 2000);

    } catch (error) {
      setToast({
        type: 'error',
        message: currentLanguage === 'zh-TW' 
          ? '订阅失败，请重试' 
          : currentLanguage === 'ja' 
          ? 'サブスクリプションに失敗しました。再試行してください'
          : 'Subscription failed, please try again'
      });
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <SubscriptionPlans 
          currentLanguage={currentLanguage}
          onSubscribe={handleSubscribe}
        />
      </main>

      <Footer />
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          show={true}
        />
      )}
    </div>
  );
};

export default Subscription; 