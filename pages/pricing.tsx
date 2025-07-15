import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubscriptionPlans from '../components/SubscriptionPlans';
import Toast from '../components/Toast';
import { Language } from '../types/language';

const Pricing: NextPage = () => {
  const { data: session } = useSession();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
  };

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      setToast({
        type: 'error',
        message: currentLanguage === 'zh-TW' 
          ? '请先登录以订阅计划' 
          : currentLanguage === 'ja' 
          ? 'プランを購読するにはログインしてください'
          : 'Please login to subscribe to a plan'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
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

export default Pricing; 