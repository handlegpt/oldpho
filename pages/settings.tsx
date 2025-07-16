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
import AdvancedSettings from '../components/AdvancedSettings';
import UserRoleManager from '../components/UserRoleManager';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Image from 'next/image';

const Settings: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'roles' | 'analytics'>('general');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    processingNotifications: true,
    autoSave: true,
    highQualityMode: false
  });

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  const handleLanguageChange = (language: string) => {
    setLanguage(language as any);
  };

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAdvancedSettingsChange = (newSettings: any) => {
    console.log('Advanced settings changed:', newSettings);
    // Save to database or API here
  };

  const handleRoleChange = (role: string) => {
    console.log('User role changed:', role);
    // Update user role in database here
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

  const tabs = [
    {
      id: 'general',
      name: currentLanguage === 'zh-TW' ? '基本设置' : currentLanguage === 'ja' ? '基本設定' : 'General',
      icon: '⚙️'
    },
    {
      id: 'advanced',
      name: currentLanguage === 'zh-TW' ? '高级设置' : currentLanguage === 'ja' ? '詳細設定' : 'Advanced',
      icon: '🔧'
    },
    {
      id: 'roles',
      name: currentLanguage === 'zh-TW' ? '用户权限' : currentLanguage === 'ja' ? 'ユーザー権限' : 'Roles',
      icon: '👤'
    },
    {
      id: 'analytics',
      name: currentLanguage === 'zh-TW' ? '使用分析' : currentLanguage === 'ja' ? '使用分析' : 'Analytics',
      icon: '📊'
    }
  ];

  return (
    <>
      <Head>
        <title>
          {currentLanguage === 'zh-TW' ? '设置 - OldPho' : currentLanguage === 'ja' ? '設定 - OldPho' : 'Settings - OldPho'}
        </title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {currentLanguage === 'zh-TW' ? '账户设置' : currentLanguage === 'ja' ? 'アカウント設定' : 'Account Settings'}
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {currentLanguage === 'zh-TW' 
                  ? '管理您的账户设置、偏好和权限' 
                  : currentLanguage === 'ja' 
                  ? 'アカウント設定、設定、権限を管理'
                  : 'Manage your account settings, preferences, and permissions'
                }
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8 space-x-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-6 py-3 rounded-lg font-semibold text-lg transition-colors ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-md p-8">
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">{currentLanguage === 'zh-TW' ? '基本设置' : currentLanguage === 'ja' ? '基本設定' : 'General Settings'}</h2>
                  {/* General settings content */}
                  <div className="mb-6">
                    <label className="block mb-2 font-medium">{currentLanguage === 'zh-TW' ? '语言' : currentLanguage === 'ja' ? '言語' : 'Language'}</label>
                    <select
                      value={currentLanguage}
                      onChange={e => handleLanguageChange(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <option value="en">English</option>
                      <option value="zh-TW">繁體中文</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  {/* Other general settings... */}
                </div>
              )}
              {activeTab === 'advanced' && (
                <AdvancedSettings currentLanguage={currentLanguage} onSettingsChange={handleAdvancedSettingsChange} />
              )}
              {activeTab === 'roles' && (
                <UserRoleManager currentLanguage={currentLanguage} onRoleChange={handleRoleChange} />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsDashboard currentLanguage={currentLanguage} />
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Settings; 