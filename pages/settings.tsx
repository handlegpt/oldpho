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
import AdvancedSettings from '../components/AdvancedSettings';
import UserRoleManager from '../components/UserRoleManager';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Image from 'next/image';

const Settings: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'general' | 'advanced' | 'roles' | 'analytics'>('general');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    processingNotifications: true,
    autoSave: true,
    highQualityMode: false
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

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAdvancedSettingsChange = (newSettings: any) => {
    console.log('Advanced settings changed:', newSettings);
    // Here you would typically save to database or API
  };

  const handleRoleChange = (role: string) => {
    console.log('User role changed:', role);
    // Here you would typically update user role in database
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
        <Header 
          photo={null} 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />

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

            {/* User Info Card */}
            <AnimatedCard className="bg-white p-6 mb-8 shadow-lg">
              <div className="flex items-center space-x-4">
                <Image
                  src={session.user?.image || '/default-avatar.png'}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {session.user?.name || session.user?.email}
                  </h2>
                  <p className="text-gray-600">{session.user?.email}</p>
                  <p className="text-sm text-blue-600">
                    {currentLanguage === 'zh-TW' ? '已登录' : currentLanguage === 'ja' ? 'ログイン中' : 'Signed in'}
                  </p>
                </div>
              </div>
            </AnimatedCard>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'general' && (
                <AnimatedCard className="bg-white p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-6">
                    {currentLanguage === 'zh-TW' ? '基本设置' : currentLanguage === 'ja' ? '基本設定' : 'General Settings'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {currentLanguage === 'zh-TW' ? '邮件通知' : currentLanguage === 'ja' ? 'メール通知' : 'Email Notifications'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentLanguage === 'zh-TW' 
                            ? '接收处理完成和重要更新的邮件通知' 
                            : currentLanguage === 'ja' 
                            ? '処理完了と重要な更新のメール通知を受信'
                            : 'Receive email notifications for completed processing and important updates'
                          }
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {currentLanguage === 'zh-TW' ? '处理进度通知' : currentLanguage === 'ja' ? '処理進捗通知' : 'Processing Notifications'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentLanguage === 'zh-TW' 
                            ? '在浏览器中显示处理进度通知' 
                            : currentLanguage === 'ja' 
                            ? 'ブラウザで処理進捗通知を表示'
                            : 'Show processing progress notifications in browser'
                          }
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.processingNotifications}
                          onChange={(e) => handleSettingChange('processingNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {currentLanguage === 'zh-TW' ? '自动保存' : currentLanguage === 'ja' ? '自動保存' : 'Auto Save'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentLanguage === 'zh-TW' 
                            ? '自动保存处理中的图片' 
                            : currentLanguage === 'ja' 
                            ? '処理中の画像を自動保存'
                            : 'Automatically save images during processing'
                          }
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoSave}
                          onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {currentLanguage === 'zh-TW' ? '高质量模式' : currentLanguage === 'ja' ? '高品質モード' : 'High Quality Mode'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {currentLanguage === 'zh-TW' 
                            ? '使用更高质量的处理选项（可能消耗更多配额）' 
                            : currentLanguage === 'ja' 
                            ? 'より高品質の処理オプションを使用（より多くのクォータを消費する可能性があります）'
                            : 'Use higher quality processing options (may consume more quota)'
                          }
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.highQualityMode}
                          onChange={(e) => handleSettingChange('highQualityMode', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </AnimatedCard>
              )}

              {activeTab === 'advanced' && (
                <AdvancedSettings 
                  currentLanguage={currentLanguage}
                  onSettingsChange={handleAdvancedSettingsChange}
                />
              )}

              {activeTab === 'roles' && (
                <UserRoleManager 
                  currentLanguage={currentLanguage}
                  onRoleChange={handleRoleChange}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard 
                  currentLanguage={currentLanguage}
                />
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