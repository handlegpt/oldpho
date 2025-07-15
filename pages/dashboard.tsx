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
import Link from 'next/link';
import Image from 'next/image';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [userStats, setUserStats] = useState({
    totalRestorations: 0,
    remainingGenerations: 5,
    planType: 'free',
    joinDate: new Date().toISOString()
  });

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

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setStoredLanguage(language);
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
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Dashboard - OldPho</title>
        <meta name="description" content="Your OldPho dashboard" />
      </Head>
      
      <Header 
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {getDashboardText('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {getDashboardText('welcome')}, {session.user?.name || session.user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Statistics */}
            <div className="lg:col-span-2">
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {getDashboardText('stats')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats.totalRestorations}
                    </div>
                    <div className="text-sm text-blue-700">
                      {getDashboardText('totalRestorations')}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.remainingGenerations}
                    </div>
                    <div className="text-sm text-green-700">
                      {getDashboardText('remainingGenerations')}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 capitalize">
                      {userStats.planType}
                    </div>
                    <div className="text-sm text-purple-700">
                      {getDashboardText('planType')}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Quick Actions */}
            <div>
              <AnimatedCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {getDashboardText('quickActions')}
                </h2>
                <div className="space-y-4">
                  <Link
                    href="/restore"
                    className="block w-full bg-blue-600 text-white p-4 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors duration-150 transform hover:scale-105 active:scale-95"
                  >
                    {getDashboardText('restorePhoto')}
                  </Link>
                  <Link
                    href="/pricing"
                    className="block w-full bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors duration-150 transform hover:scale-105 active:scale-95"
                  >
                    {getDashboardText('viewPricing')}
                  </Link>
                  <Link
                    href="/settings"
                    className="block w-full bg-gray-100 text-gray-700 p-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors duration-150 transform hover:scale-105 active:scale-95"
                  >
                    {getDashboardText('accountSettings')}
                  </Link>
                  <Link
                    href="/help"
                    className="block w-full bg-gray-100 text-gray-700 p-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors duration-150 transform hover:scale-105 active:scale-95"
                  >
                    {getDashboardText('helpSupport')}
                  </Link>
                </div>
              </AnimatedCard>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {getDashboardText('recentActivity')}
              </h2>
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>{getDashboardText('noRecentActivity')}</p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard; 