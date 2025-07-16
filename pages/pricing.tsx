import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubscriptionPlans from '../components/SubscriptionPlans';
import Toast from '../components/Toast';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Pricing: NextPage = () => {
  const { data: session } = useSession();
  const { currentLanguage } = useLanguage();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
    // Subscription logic here
  };

  return (
    <>
      <Header photo={undefined} />
      <main className="container mx-auto px-4 py-8">
        {/* Pricing content... */}
      </main>
      <Footer />
    </>
  );
};

export default Pricing; 