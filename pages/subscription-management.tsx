import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Language, translations } from '../utils/translations';
import { getStoredLanguage, setStoredLanguage } from '../utils/languageStorage';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

const SubscriptionManagement: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    const storedLanguage = getStoredLanguage();
    setCurrentLanguage(storedLanguage);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  useEffect(() => {
    // 模拟加载订阅信息
    setTimeout(() => {
      const mockSubscription: Subscription = {
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

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      // 模拟取消订阅
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setCanceling(false);
    }
  };

  const getSubscriptionText = (key: string) => {
    const texts = {
      title: {
        'en': 'Subscription Management',
        'zh-TW': '订阅管理',
        'ja': 'サブスクリプション管理'
      },
      subtitle: {
        'en': 'Manage your subscription and billing',
        'zh-TW': '管理您的订阅和账单',
        'ja': 'サブスクリプションと請求を管理'
      },
      currentPlan: {
        'en': 'Current Plan',
        'zh-TW': '当前计划',
        'ja': '現在のプラン'
      },
      status: {
        'en': 'Status',
        'zh-TW': '状态',
        'ja': 'ステータス'
      },
      nextBilling: {
        'en': 'Next Billing',
        'zh-TW': '下次账单',
        'ja': '次回請求'
      },
      cancelAtPeriodEnd: {
        'en': 'Cancels at period end',
        'zh-TW': '在周期结束时取消',
        'ja': '期間終了時にキャンセル'
      },
      cancelSubscription: {
        'en': 'Cancel Subscription',
        'zh-TW': '取消订阅',
        'ja': 'サブスクリプションをキャンセル'
      },
      canceling: {
        'en': 'Canceling...',
        'zh-TW': '取消中...',
        'ja': 'キャンセル中...'
      },
      upgrade: {
        'en': 'Upgrade Plan',
        'zh-TW': '升级计划',
        'ja': 'プランをアップグレード'
      },
      billingHistory: {
        'en': 'Billing History',
        'zh-TW': '账单历史',
        'ja': '請求履歴'
      },
      paymentMethod: {
        'en': 'Payment Method',
        'zh-TW': '支付方式',
        'ja': '支払い方法'
      },
      noSubscription: {
        'en': 'No active subscription',
        'zh-TW': '无活跃订阅',
        'ja': 'アクティブなサブスクリプションがありません'
      },
      getPlan: {
        'en': 'Get a Plan',
        'zh-TW': '获取计划',
        'ja': 'プランを取得'
      },
      active: {
        'en': 'Active',
        'zh-TW': '活跃',
        'ja': 'アクティブ'
      },
      canceled: {
        'en': 'Canceled',
        'zh-TW': '已取消',
        'ja': 'キャンセル済み'
      },
      pastDue: {
        'en': 'Past Due',
        'zh-TW': '逾期',
        'ja': '支払い遅延'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const getPlanName = (planId: string) => {
    const planNames = {
      free: {
        'en': 'Free Plan',
        'zh-TW': '免费计划',
        'ja': '無料プラン'
      },
      pro: {
        'en': 'Pro Plan',
        'zh-TW': '专业计划',
        'ja': 'プロプラン'
      },
      enterprise: {
        'en': 'Enterprise Plan',
        'zh-TW': '企业计划',
        'ja': 'エンタープライズプラン'
      }
    };
    return planNames[planId as keyof typeof planNames]?.[currentLanguage] || planNames[planId as keyof typeof planNames]?.['en'] || planId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'past_due': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" color="blue" text="Loading..." />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Subscription Management - OldPho</title>
        <meta name="description" content="Manage your subscription" />
      </Head>
      
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {getSubscriptionText('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {getSubscriptionText('subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" color="blue" text="Loading subscription..." />
            </div>
          ) : !subscription ? (
            <AnimatedCard className="p-12 text-center">
              <div className="text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-lg font-medium">{getSubscriptionText('noSubscription')}</p>
                <button className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {getSubscriptionText('getPlan')}
                </button>
              </div>
            </AnimatedCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Subscription */}
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {getSubscriptionText('currentPlan')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">{getSubscriptionText('currentPlan')}</p>
                    <p className="font-medium">{getPlanName(subscription.planId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{getSubscriptionText('status')}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                      {getSubscriptionText(subscription.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{getSubscriptionText('nextBilling')}</p>
                    <p className="font-medium">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                  {subscription.cancelAtPeriodEnd && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        {getSubscriptionText('cancelAtPeriodEnd')}
                      </p>
                    </div>
                  )}
                </div>
              </AnimatedCard>

              {/* Actions */}
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {currentLanguage === 'zh-TW' ? '操作' : currentLanguage === 'ja' ? 'アクション' : 'Actions'}
                </h2>
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    {getSubscriptionText('upgrade')}
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    {getSubscriptionText('billingHistory')}
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    {getSubscriptionText('paymentMethod')}
                  </button>
                  {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={canceling}
                      className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {canceling ? getSubscriptionText('canceling') : getSubscriptionText('cancelSubscription')}
                    </button>
                  )}
                </div>
              </AnimatedCard>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubscriptionManagement; 