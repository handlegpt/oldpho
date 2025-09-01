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
import Image from 'next/image';

const Settings: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'billing' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  const getSettingsText = (key: string) => {
    const texts = {
      title: {
        'en': 'Account Settings',
        'zh-TW': '账户设置',
        'ja': 'アカウント設定'
      },
      subtitle: {
        'en': 'Manage your account settings and preferences',
        'zh-TW': '管理您的账户设置和偏好',
        'ja': 'アカウント設定と設定を管理'
      },
      profile: {
        'en': 'Profile',
        'zh-TW': '个人资料',
        'ja': 'プロフィール'
      },
      preferences: {
        'en': 'Preferences',
        'zh-TW': '偏好设置',
        'ja': '設定'
      },
      security: {
        'en': 'Security',
        'zh-TW': '安全设置',
        'ja': 'セキュリティ'
      },
      billing: {
        'en': 'Billing',
        'zh-TW': '账单管理',
        'ja': '請求管理'
      },
      notifications: {
        'en': 'Notifications',
        'zh-TW': '通知设置',
        'ja': '通知設定'
      },
      displayName: {
        'en': 'Display Name',
        'zh-TW': '显示名称',
        'ja': '表示名'
      },
      email: {
        'en': 'Email Address',
        'zh-TW': '邮箱地址',
        'ja': 'メールアドレス'
      },
      language: {
        'en': 'Language',
        'zh-TW': '语言',
        'ja': '言語'
      },
      timezone: {
        'en': 'Timezone',
        'zh-TW': '时区',
        'ja': 'タイムゾーン'
      },
      theme: {
        'en': 'Theme',
        'zh-TW': '主题',
        'ja': 'テーマ'
      },
      password: {
        'en': 'Password',
        'zh-TW': '密码',
        'ja': 'パスワード'
      },
      twoFactor: {
        'en': 'Two-Factor Authentication',
        'zh-TW': '双重认证',
        'ja': '二段階認証'
      },
      plan: {
        'en': 'Current Plan',
        'zh-TW': '当前套餐',
        'ja': '現在のプラン'
      },
      usage: {
        'en': 'Usage',
        'zh-TW': '使用情况',
        'ja': '使用状況'
      },
      emailNotifications: {
        'en': 'Email Notifications',
        'zh-TW': '邮件通知',
        'ja': 'メール通知'
      },
      pushNotifications: {
        'en': 'Push Notifications',
        'zh-TW': '推送通知',
        'ja': 'プッシュ通知'
      },
      save: {
        'en': 'Save Changes',
        'zh-TW': '保存更改',
        'ja': '変更を保存'
      },
      cancel: {
        'en': 'Cancel',
        'zh-TW': '取消',
        'ja': 'キャンセル'
      },
      update: {
        'en': 'Update',
        'zh-TW': '更新',
        'ja': '更新'
      },
      delete: {
        'en': 'Delete Account',
        'zh-TW': '删除账户',
        'ja': 'アカウント削除'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || key;
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: currentLanguage === 'zh-TW' ? '设置已保存' : currentLanguage === 'ja' ? '設定が保存されました' : 'Settings saved successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: currentLanguage === 'zh-TW' ? '保存失败' : currentLanguage === 'ja' ? '保存に失敗しました' : 'Failed to save settings' });
    } finally {
      setIsLoading(false);
    }
  };

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

  const tabs = [
    { id: 'profile', icon: '👤', text: getSettingsText('profile') },
    { id: 'preferences', icon: '⚙️', text: getSettingsText('preferences') },
    { id: 'security', icon: '🔒', text: getSettingsText('security') },
    { id: 'billing', icon: '💳', text: getSettingsText('billing') },
    { id: 'notifications', icon: '🔔', text: getSettingsText('notifications') }
  ];

  return (
    <>
      <Head>
        <title>{getSettingsText('title')} - Shin AI</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={session?.user?.image || undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {getSettingsText('title')}
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {getSettingsText('subtitle')}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">⚙️</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs Navigation */}
            <section className="mb-8">
              <AnimatedCard>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-strong border border-white/50">
                  <div className="flex flex-wrap justify-center gap-2 mobile-tabs">
                    {tabs.map(tab => (
                                              <button
                          key={tab.id}
                          className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center mobile-tab ${
                            activeTab === tab.id 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => setActiveTab(tab.id as any)}
                        >
                        <span className="mr-2 text-xl">{tab.icon}</span>
                        {tab.text}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            </section>

            {/* Tab Content */}
            <section>
              <AnimatedCard>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-strong border border-white/50 p-8">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                          <span className="mr-3">👤</span>
                          {getSettingsText('profile')}
                        </h2>
                        
                        {/* Profile Picture */}
                        <div className="mb-8">
                          <label className="block mb-4 font-semibold text-gray-700">
                            {currentLanguage === 'zh-TW' ? '头像' : currentLanguage === 'ja' ? 'アバター' : 'Profile Picture'}
                          </label>
                          <div className="flex items-center space-x-6">
                            <div className="relative">
                              <Image
                                src={session.user?.image || '/default-avatar.png'}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full border-4 border-gray-200"
                              />
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                {currentLanguage === 'zh-TW' ? '更换头像' : currentLanguage === 'ja' ? 'アバターを変更' : 'Change Picture'}
                              </button>
                              <p className="text-sm text-gray-500 mt-1">
                                {currentLanguage === 'zh-TW' ? '支持 JPG、PNG 格式，最大 2MB' :
                                 currentLanguage === 'ja' ? 'JPG、PNG形式をサポート、最大2MB' :
                                 'Supports JPG, PNG formats, max 2MB'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Profile Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block mb-3 font-semibold text-gray-700">
                              {getSettingsText('displayName')}
                            </label>
                            <input
                              type="text"
                              defaultValue={session.user?.name || ''}
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={currentLanguage === 'zh-TW' ? '输入显示名称' : currentLanguage === 'ja' ? '表示名を入力' : 'Enter display name'}
                            />
                          </div>
                          <div>
                            <label className="block mb-3 font-semibold text-gray-700">
                              {getSettingsText('email')}
                            </label>
                            <input
                              type="email"
                              defaultValue={session.user?.email || ''}
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={currentLanguage === 'zh-TW' ? '输入邮箱地址' : currentLanguage === 'ja' ? 'メールアドレスを入力' : 'Enter email address'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                          <span className="mr-3">⚙️</span>
                          {getSettingsText('preferences')}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block mb-3 font-semibold text-gray-700">
                              {getSettingsText('language')}
                            </label>
                            <select
                              value={currentLanguage}
                              onChange={e => setLanguage(e.target.value as any)}
                              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            >
                              <option value="en">English</option>
                              <option value="zh-TW">繁體中文</option>
                              <option value="ja">日本語</option>
                            </select>
                          </div>
                          <div>
                            <label className="block mb-3 font-semibold text-gray-700">
                              {getSettingsText('timezone')}
                            </label>
                            <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                              <option value="UTC">UTC</option>
                              <option value="Asia/Tokyo">Asia/Tokyo</option>
                              <option value="Asia/Taipei">Asia/Taipei</option>
                              <option value="America/New_York">America/New_York</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-6">
                          <label className="block mb-3 font-semibold text-gray-700">
                            {getSettingsText('theme')}
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input type="radio" name="theme" value="light" defaultChecked className="mr-2" />
                              <span>{currentLanguage === 'zh-TW' ? '浅色' : currentLanguage === 'ja' ? 'ライト' : 'Light'}</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="theme" value="dark" className="mr-2" />
                              <span>{currentLanguage === 'zh-TW' ? '深色' : currentLanguage === 'ja' ? 'ダーク' : 'Dark'}</span>
                            </label>
                            <label className="flex items-center">
                              <input type="radio" name="theme" value="auto" className="mr-2" />
                              <span>{currentLanguage === 'zh-TW' ? '自动' : currentLanguage === 'ja' ? '自動' : 'Auto'}</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                          <span className="mr-3">🔒</span>
                          {getSettingsText('security')}
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h3 className="text-lg font-semibold mb-4">{getSettingsText('password')}</h3>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              {currentLanguage === 'zh-TW' ? '更改密码' : currentLanguage === 'ja' ? 'パスワードを変更' : 'Change Password'}
                            </button>
                          </div>

                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h3 className="text-lg font-semibold mb-4">{getSettingsText('twoFactor')}</h3>
                            <div className="flex items-center justify-between">
                              <p className="text-gray-600">
                                {currentLanguage === 'zh-TW' ? '启用双重认证以提高账户安全性' :
                                 currentLanguage === 'ja' ? 'アカウントのセキュリティを向上させるために二段階認証を有効にする' :
                                 'Enable two-factor authentication to enhance account security'}
                              </p>
                              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                {currentLanguage === 'zh-TW' ? '启用' : currentLanguage === 'ja' ? '有効にする' : 'Enable'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing Tab */}
                  {activeTab === 'billing' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                          <span className="mr-3">💳</span>
                          {getSettingsText('billing')}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                            <h3 className="text-lg font-semibold mb-2">{getSettingsText('plan')}</h3>
                            <p className="text-2xl font-bold text-blue-600 mb-2">Free</p>
                            <p className="text-gray-600 mb-4">
                              {currentLanguage === 'zh-TW' ? '基础功能，每月 10 次修复' :
                               currentLanguage === 'ja' ? '基本機能、月10回の修復' :
                               'Basic features, 10 restorations per month'}
                            </p>
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              {currentLanguage === 'zh-TW' ? '升级套餐' : currentLanguage === 'ja' ? 'プランをアップグレード' : 'Upgrade Plan'}
                            </button>
                          </div>

                          <div className="p-6 bg-gray-50 rounded-xl">
                            <h3 className="text-lg font-semibold mb-2">{getSettingsText('usage')}</h3>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm">
                                  <span>{currentLanguage === 'zh-TW' ? '本月已使用' : currentLanguage === 'ja' ? '今月使用済み' : 'Used this month'}</span>
                                  <span>0 / 10</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                          <span className="mr-3">🔔</span>
                          {getSettingsText('notifications')}
                        </h2>
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h4 className="font-semibold text-gray-900">{getSettingsText('emailNotifications')}</h4>
                              <p className="text-sm text-gray-600">
                                {currentLanguage === 'zh-TW' ? '接收处理完成和账户相关通知' :
                                 currentLanguage === 'ja' ? '処理完了とアカウント関連の通知を受け取る' :
                                 'Receive processing completion and account-related notifications'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                              <h4 className="font-semibold text-gray-900">{getSettingsText('pushNotifications')}</h4>
                              <p className="text-sm text-gray-600">
                                {currentLanguage === 'zh-TW' ? '接收浏览器推送通知' :
                                 currentLanguage === 'ja' ? 'ブラウザのプッシュ通知を受け取る' :
                                 'Receive browser push notifications'}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                    <button className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors">
                      {getSettingsText('cancel')}
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading && <LoadingSpinner size="sm" />}
                      <span className="ml-2">{getSettingsText('save')}</span>
                    </button>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div className={`mt-4 p-4 rounded-xl ${
                      message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {message.text}
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

export default Settings; 