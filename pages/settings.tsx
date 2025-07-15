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
import Image from 'next/image';

const Settings: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
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

  const getSettingsText = (key: string) => {
    const texts = {
      title: {
        'en': 'Account Settings',
        'zh-TW': '账户设置',
        'ja': 'アカウント設定'
      },
      accountInfo: {
        'en': 'Account Information',
        'zh-TW': '账户信息',
        'ja': 'アカウント情報'
      },
      preferences: {
        'en': 'Preferences',
        'zh-TW': '偏好设置',
        'ja': '設定'
      },
      notifications: {
        'en': 'Notifications',
        'zh-TW': '通知设置',
        'ja': '通知設定'
      },
      emailNotifications: {
        'en': 'Email Notifications',
        'zh-TW': '邮件通知',
        'ja': 'メール通知'
      },
      processingNotifications: {
        'en': 'Processing Notifications',
        'zh-TW': '处理通知',
        'ja': '処理通知'
      },
      autoSave: {
        'en': 'Auto Save',
        'zh-TW': '自动保存',
        'ja': '自動保存'
      },
      highQualityMode: {
        'en': 'High Quality Mode',
        'zh-TW': '高质量模式',
        'ja': '高品質モード'
      },
      saveChanges: {
        'en': 'Save Changes',
        'zh-TW': '保存更改',
        'ja': '変更を保存'
      },
      name: {
        'en': 'Name',
        'zh-TW': '姓名',
        'ja': '名前'
      },
      email: {
        'en': 'Email',
        'zh-TW': '邮箱',
        'ja': 'メール'
      },
      memberSince: {
        'en': 'Member Since',
        'zh-TW': '注册时间',
        'ja': '登録日'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>Settings - OldPho</title>
        <meta name="description" content="Your OldPho account settings" />
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
              {getSettingsText('title')}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Account Information */}
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {getSettingsText('accountInfo')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Image
                    alt="Profile picture"
                    src={session.user?.image || '/default-avatar.png'}
                    className="w-16 h-16 rounded-full"
                    width={64}
                    height={64}
                  />
                  <div>
                    <p className="text-sm text-gray-500">{getSettingsText('name')}</p>
                    <p className="font-medium">{session.user?.name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{getSettingsText('email')}</p>
                  <p className="font-medium">{session.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{getSettingsText('memberSince')}</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </AnimatedCard>

            {/* Preferences */}
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {getSettingsText('preferences')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getSettingsText('autoSave')}</p>
                    <p className="text-sm text-gray-500">
                      {currentLanguage === 'zh-TW' 
                        ? '自动保存处理结果' 
                        : currentLanguage === 'ja' 
                        ? '処理結果を自動保存'
                        : 'Automatically save processing results'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getSettingsText('highQualityMode')}</p>
                    <p className="text-sm text-gray-500">
                      {currentLanguage === 'zh-TW' 
                        ? '使用更高质量的处理模式' 
                        : currentLanguage === 'ja' 
                        ? 'より高品質な処理モードを使用'
                        : 'Use higher quality processing mode'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('highQualityMode', !settings.highQualityMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.highQualityMode ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.highQualityMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </AnimatedCard>

            {/* Notifications */}
            <AnimatedCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {getSettingsText('notifications')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getSettingsText('emailNotifications')}</p>
                    <p className="text-sm text-gray-500">
                      {currentLanguage === 'zh-TW' 
                        ? '接收邮件通知' 
                        : currentLanguage === 'ja' 
                        ? 'メール通知を受信'
                        : 'Receive email notifications'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{getSettingsText('processingNotifications')}</p>
                    <p className="text-sm text-gray-500">
                      {currentLanguage === 'zh-TW' 
                        ? '处理完成时通知' 
                        : currentLanguage === 'ja' 
                        ? '処理完了時に通知'
                        : 'Notify when processing is complete'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('processingNotifications', !settings.processingNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.processingNotifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.processingNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-150 transform hover:scale-105 active:scale-95">
              {getSettingsText('saveChanges')}
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings; 