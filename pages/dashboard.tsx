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
import LoadingSpinner from '../components/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [userStats, setUserStats] = useState({
    totalRestorations: 0,
    remainingGenerations: 5,
    planType: 'free',
    joinDate: new Date().toISOString(),
    thisMonthRestorations: 0,
    totalStorage: 0,
    usedStorage: 0
  });

  const [loading, setLoading] = useState(true);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'restoration',
      title: 'Family Photo Restoration',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    },
    {
      id: 2,
      type: 'upgrade',
      title: 'Plan Upgrade',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    }
  ]);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  // Fetch user stats when session is available
  useEffect(() => {
    const fetchStats = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          setLoading(true);
          const response = await fetch('/api/stats');
          if (response.ok) {
            const stats = await response.json();
            setUserStats(stats);
          } else {
            console.error('Failed to fetch stats:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStats();
  }, [status, session]);

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

  const getDashboardText = (key: string) => {
    const texts = {
      title: {
        'en': 'Dashboard',
        'zh-TW': '仪表板',
        'ja': 'ダッシュボード'
      },
      welcome: {
        'en': 'Welcome back',
        'zh-TW': '欢迎回来',
        'ja': 'おかえりなさい'
      },
      stats: {
        'en': 'Your Statistics',
        'zh-TW': '您的统计',
        'ja': 'あなたの統計'
      },
      totalRestorations: {
        'en': 'Total Restorations',
        'zh-TW': '总修复次数',
        'ja': '総復元回数'
      },
      remainingGenerations: {
        'en': 'Remaining Generations',
        'zh-TW': '剩余次数',
        'ja': '残り回数'
      },
      planType: {
        'en': 'Current Plan',
        'zh-TW': '当前计划',
        'ja': '現在のプラン'
      },
      thisMonth: {
        'en': 'This Month',
        'zh-TW': '本月',
        'ja': '今月'
      },
      storage: {
        'en': 'Storage Used',
        'zh-TW': '已用存储',
        'ja': '使用済みストレージ'
      },
      quickActions: {
        'en': 'Quick Actions',
        'zh-TW': '快速操作',
        'ja': 'クイックアクション'
      },
      restorePhoto: {
        'en': 'Restore Photo',
        'zh-TW': '修复照片',
        'ja': '写真を復元'
      },
      viewPricing: {
        'en': 'View Pricing',
        'zh-TW': '查看价格',
        'ja': '料金を見る'
      },
      accountSettings: {
        'en': 'Account Settings',
        'zh-TW': '账户设置',
        'ja': 'アカウント設定'
      },
      helpSupport: {
        'en': 'Help & Support',
        'zh-TW': '帮助与支持',
        'ja': 'ヘルプ＆サポート'
      },
      recentActivity: {
        'en': 'Recent Activity',
        'zh-TW': '最近活动',
        'ja': '最近のアクティビティ'
      },
      noRecentActivity: {
        'en': 'No recent activity',
        'zh-TW': '暂无最近活动',
        'ja': '最近のアクティビティはありません'
      },
      upgrade: {
        'en': 'Upgrade Plan',
        'zh-TW': '升级计划',
        'ja': 'プランをアップグレード'
      },
      viewHistory: {
        'en': 'View History',
        'zh-TW': '查看历史',
        'ja': '履歴を見る'
      },
      free: {
        'en': 'Free',
        'zh-TW': '免费版',
        'ja': '無料'
      },
      pro: {
        'en': 'Pro',
        'zh-TW': '专业版',
        'ja': 'プロ'
      },
      enterprise: {
        'en': 'Enterprise',
        'zh-TW': '企业版',
        'ja': 'エンタープライズ'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'zh-TW' ? 'zh-TW' : currentLanguage === 'ja' ? 'ja-JP' : 'en-US');
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'free':
        return getDashboardText('free');
      case 'pro':
        return getDashboardText('pro');
      case 'enterprise':
        return getDashboardText('enterprise');
      default:
        return getDashboardText('free');
    }
  };

  return (
    <>
      <Head>
        <title>{getDashboardText('title')} - OldPho</title>
        <meta name="description" content="User dashboard for OldPho" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getDashboardText('welcome')}, {session.user?.name || session.user?.email}!
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {getDashboardText('stats')}
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{getDashboardText('totalRestorations')}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                      ) : (
                        userStats.totalRestorations
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{getDashboardText('remainingGenerations')}</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.remainingGenerations}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{getDashboardText('planType')}</p>
                    <p className="text-2xl font-bold text-gray-900">{getPlanDisplayName(userStats.planType)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{getDashboardText('thisMonth')}</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.thisMonthRestorations}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">{getDashboardText('quickActions')}</h2>
                  <div className="space-y-4">
                    <Link href="/restore" className="block w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium">
                      {getDashboardText('restorePhoto')}
                    </Link>
                    <Link href="/pricing" className="block w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium">
                      {getDashboardText('upgrade')}
                    </Link>
                    <Link href="/account" className="block w-full p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center font-medium">
                      {getDashboardText('accountSettings')}
                    </Link>
                    <Link href="/support" className="block w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-medium">
                      {getDashboardText('helpSupport')}
                    </Link>
                  </div>
                </AnimatedCard>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">{getDashboardText('recentActivity')}</h2>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'restoration' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              <svg className={`w-5 h-5 ${
                                activity.type === 'restoration' ? 'text-blue-600' : 'text-green-600'
                              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {activity.type === 'restoration' ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                )}
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500">{getDashboardText('noRecentActivity')}</p>
                    </div>
                  )}
                </AnimatedCard>
              </div>
            </div>

            {/* Storage Usage */}
            <div className="mt-8">
              <AnimatedCard className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">{getDashboardText('storage')}</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{getDashboardText('storage')}</span>
                    <span>{userStats.usedStorage}MB / {userStats.totalStorage}MB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(userStats.usedStorage / userStats.totalStorage) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard; 