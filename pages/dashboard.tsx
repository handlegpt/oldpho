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
    joinDate: new Date().toISOString()
  });

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

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
    <>
      <Head>
        <title>{getDashboardText('title')} - OldPho</title>
        <meta name="description" content="User dashboard for OldPho" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getDashboardText('welcome')}, {session.user?.name || session.user?.email}!
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {getDashboardText('stats')}
              </p>
            </div>
            {/* User statistics and actions... */}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard; 