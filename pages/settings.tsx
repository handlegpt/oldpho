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
          {currentLanguage === 'zh-TW' ? '设置 - Shin AI' : currentLanguage === 'ja' ? '設定 - Shin AI' : 'Settings - Shin AI'}
        </title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Settings
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                {currentLanguage === 'zh-TW' ? '账户设置' : currentLanguage === 'ja' ? 'アカウント設定' : 'Account Settings'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {currentLanguage === 'zh-TW' 
                  ? '管理您的账户设置、偏好和权限' 
                  : currentLanguage === 'ja' 
                  ? 'アカウント設定、設定、権限を管理'
                  : 'Manage your account settings, preferences, and permissions'
                }
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50">
                <div className="flex space-x-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center ${
                        activeTab === tab.id 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                      onClick={() => setActiveTab(tab.id as any)}
                    >
                      <span className="mr-2 text-xl">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">{currentLanguage === 'zh-TW' ? '基本设置' : currentLanguage === 'ja' ? '基本設定' : 'General Settings'}</h2>
                  
                  {/* Profile Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">{currentLanguage === 'zh-TW' ? '个人资料' : currentLanguage === 'ja' ? 'プロフィール' : 'Profile'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-3 font-medium text-gray-700">{currentLanguage === 'zh-TW' ? '显示名称' : currentLanguage === 'ja' ? '表示名' : 'Display Name'}</label>
                        <input
                          type="text"
                          defaultValue={session.user?.name || ''}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={currentLanguage === 'zh-TW' ? '输入显示名称' : currentLanguage === 'ja' ? '表示名を入力' : 'Enter display name'}
                        />
                      </div>
                      <div>
                        <label className="block mb-3 font-medium text-gray-700">{currentLanguage === 'zh-TW' ? '邮箱地址' : currentLanguage === 'ja' ? 'メールアドレス' : 'Email Address'}</label>
                        <input
                          type="email"
                          defaultValue={session.user?.email || ''}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">{currentLanguage === 'zh-TW' ? '偏好设置' : currentLanguage === 'ja' ? '設定' : 'Preferences'}</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block mb-3 font-medium text-gray-700">{currentLanguage === 'zh-TW' ? '语言' : currentLanguage === 'ja' ? '言語' : 'Language'}</label>
                        <select
                          value={currentLanguage}
                          onChange={e => handleLanguageChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="en">English</option>
                          <option value="zh-TW">繁體中文</option>
                          <option value="ja">日本語</option>
                        </select>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">{currentLanguage === 'zh-TW' ? '邮件通知' : currentLanguage === 'ja' ? 'メール通知' : 'Email Notifications'}</h4>
                            <p className="text-sm text-gray-600">{currentLanguage === 'zh-TW' ? '接收处理完成通知' : currentLanguage === 'ja' ? '処理完了通知を受け取る' : 'Receive notifications when processing is complete'}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.emailNotifications}
                              onChange={e => handleSettingChange('emailNotifications', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium text-gray-900">{currentLanguage === 'zh-TW' ? '高质量模式' : currentLanguage === 'ja' ? '高品質モード' : 'High Quality Mode'}</h4>
                            <p className="text-sm text-gray-600">{currentLanguage === 'zh-TW' ? '使用更高质量的AI处理' : currentLanguage === 'ja' ? 'より高品質なAI処理を使用' : 'Use higher quality AI processing'}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.highQualityMode}
                              onChange={e => handleSettingChange('highQualityMode', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'advanced' && (
                <AdvancedSettings onSettingsChange={handleAdvancedSettingsChange} />
              )}
              {activeTab === 'roles' && (
                <UserRoleManager onRoleChange={handleRoleChange} />
              )}
              {activeTab === 'analytics' && (
                <AnalyticsDashboard />
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