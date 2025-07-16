import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { translations } from '../utils/translations';
import { useLanguage } from '../contexts/LanguageContext';

const SubscriptionManagement: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulate loading subscription info
    setTimeout(() => {
      const mockSubscription = {
        id: 'sub_123456',
        planId: 'pro',
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        stripeCustomerId: 'cus_123456',
        stripeSubscriptionId: 'sub_123456'
      };
      setSubscription(mockSubscription);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      // Simulate cancel subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubscription((prev: any) => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <>
      <Header photo={undefined} />
      <main className="container mx-auto px-4 py-8">
        {/* Subscription management content... */}
      </main>
      <Footer />
    </>
  );
};

export default SubscriptionManagement; 