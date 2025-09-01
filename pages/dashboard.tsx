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
  const [permissions, setPermissions] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', restorations: 3 },
    { month: 'Feb', restorations: 5 },
    { month: 'Mar', restorations: 2 },
    { month: 'Apr', restorations: 7 },
    { month: 'May', restorations: 4 },
    { month: 'Jun', restorations: 6 }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'restoration',
      title: 'Family Photo Restoration',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      thumbnail: '/api/uploads/sample1.jpg'
    },
    {
      id: 2,
      type: 'upgrade',
      title: 'Plan Upgrade',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      thumbnail: null
    }
  ]);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  // Fetch user stats and permissions when session is available
  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          setLoading(true);
          
          // Fetch stats
          const statsResponse = await fetch('/api/stats');
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            setUserStats(stats);
          } else {
            console.error('Failed to fetch stats:', statsResponse.statusText);
          }

          // Fetch permissions
          const permissionsResponse = await fetch('/api/user/permissions');
          if (permissionsResponse.ok) {
            const permissionsData = await permissionsResponse.json();
            setPermissions(permissionsData);
          } else {
            console.error('Failed to fetch permissions:', permissionsResponse.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
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
      viewGallery: {
        'en': 'View Gallery',
        'zh-TW': '查看图库',
        'ja': 'ギャラリーを見る'
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
      },
      usage: {
        'en': 'Usage',
        'zh-TW': '使用情况',
        'ja': '使用状況'
      },
      monthlyTrend: {
        'en': 'Monthly Trend',
        'zh-TW': '月度趋势',
        'ja': '月次トレンド'
      },
      performance: {
        'en': 'Performance',
        'zh-TW': '性能表现',
        'ja': 'パフォーマンス'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || key;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free':
        return '⭐';
      case 'pro':
        return '🚀';
      case 'enterprise':
        return '🏢';
      default:
        return '⭐';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'zh-TW' ? 'zh-TW' : currentLanguage === 'ja' ? 'ja-JP' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStoragePercentage = () => {
    if (userStats.totalStorage === 0) return 0;
    return Math.round((userStats.usedStorage / userStats.totalStorage) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getUsageBarColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Head>
        <title>{getDashboardText('title')} - Shin AI</title>
        <meta name="description" content="Your AI photo restoration dashboard" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={session?.user?.image || undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {getDashboardText('welcome')}, {session.user?.name || session.user?.email}!
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {currentLanguage === 'zh-TW' ? '继续您的照片修复之旅' :
                       currentLanguage === 'ja' ? '写真修復の旅を続けましょう' :
                       'Continue your photo restoration journey'}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">📸</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Grid */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {getDashboardText('stats')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Restorations */}
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🖼️</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {getDashboardText('totalRestorations')}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {userStats.totalRestorations}
                    </div>
                    <div className="text-sm text-green-600">
                      +{userStats.thisMonthRestorations} {getDashboardText('thisMonth')}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Remaining Generations */}
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⚡</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {getDashboardText('remainingGenerations')}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {userStats.remainingGenerations}
                    </div>
                    <div className="text-sm text-blue-600">
                      {currentLanguage === 'zh-TW' ? '剩余次数' :
                       currentLanguage === 'ja' ? '残り回数' :
                       'Remaining'}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Current Plan */}
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{getPlanIcon(userStats.planType)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {getDashboardText('planType')}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {getDashboardText(userStats.planType)}
                    </div>
                    <div className={`text-sm px-3 py-1 rounded-full inline-block ${getPlanColor(userStats.planType)}`}>
                      {currentLanguage === 'zh-TW' ? '当前计划' :
                       currentLanguage === 'ja' ? '現在のプラン' :
                       'Current Plan'}
                    </div>
                  </div>
                </AnimatedCard>

                {/* Storage Usage */}
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">💾</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {getDashboardText('storage')}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {getStoragePercentage()}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColor(getStoragePercentage())}`}
                        style={{ width: `${getStoragePercentage()}%` }}
                      ></div>
                    </div>
                    <div className={`text-sm ${getUsageColor(getStoragePercentage())}`}>
                      {userStats.usedStorage}MB / {userStats.totalStorage}MB
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <section className="lg:col-span-1">
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      {getDashboardText('quickActions')}
                    </h3>
                    <div className="space-y-4">
                      <Link
                        href="/restore"
                        className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-medium group"
                      >
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-medium">
                          <span className="text-white text-lg">📸</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getDashboardText('restorePhoto')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentLanguage === 'zh-TW' ? '开始新的照片修复' :
                             currentLanguage === 'ja' ? '新しい写真修復を開始' :
                             'Start a new restoration'}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/gallery"
                        className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:from-green-100 hover:to-blue-100 transition-medium group"
                      >
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-medium">
                          <span className="text-white text-lg">🖼️</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getDashboardText('viewGallery')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentLanguage === 'zh-TW' ? '查看您的照片库' :
                             currentLanguage === 'ja' ? '写真ギャラリーを表示' :
                             'View your photo gallery'}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/pricing"
                        className="flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-medium group"
                      >
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-medium">
                          <span className="text-white text-lg">💎</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getDashboardText('viewPricing')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentLanguage === 'zh-TW' ? '升级您的计划' :
                             currentLanguage === 'ja' ? 'プランをアップグレード' :
                             'Upgrade your plan'}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/help"
                        className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl hover:from-orange-100 hover:to-red-100 transition-medium group"
                      >
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-medium">
                          <span className="text-white text-lg">❓</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {getDashboardText('helpSupport')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {currentLanguage === 'zh-TW' ? '获取帮助和支持' :
                             currentLanguage === 'ja' ? 'ヘルプとサポートを取得' :
                             'Get help and support'}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              </section>

              {/* Monthly Trend Chart */}
              <section className="lg:col-span-2">
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      {getDashboardText('monthlyTrend')}
                    </h3>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {monthlyData.map((data, index) => {
                        const maxValue = Math.max(...monthlyData.map(d => d.restorations));
                        const height = (data.restorations / maxValue) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="text-xs text-gray-600 mb-2">{data.restorations}</div>
                            <div
                              className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700"
                              style={{ height: `${height}%` }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedCard>
              </section>
            </div>

            {/* Recent Activity */}
            <section className="mt-8">
              <AnimatedCard>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      {getDashboardText('recentActivity')}
                    </h3>
                    <Link
                      href="/history"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {getDashboardText('viewHistory')} →
                    </Link>
                  </div>
                  
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            {activity.type === 'restoration' ? (
                              <span className="text-blue-600 text-lg">🖼️</span>
                            ) : (
                              <span className="text-green-600 text-lg">⚡</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{activity.title}</div>
                            <div className="text-sm text-gray-600">{formatDate(activity.date)}</div>
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            {activity.status === 'completed' ? (
                              currentLanguage === 'zh-TW' ? '已完成' :
                              currentLanguage === 'ja' ? '完了' :
                              'Completed'
                            ) : activity.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-400 text-2xl">📝</span>
                      </div>
                      <p className="text-gray-500">{getDashboardText('noRecentActivity')}</p>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Dashboard; 