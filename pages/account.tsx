import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Account: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'en'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    restorationUpdates: true
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '',
        language: currentLanguage
      });
    }
  }, [session, currentLanguage]);

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

  const getAccountText = (key: string) => {
    const texts = {
      title: {
        'en': 'Account Settings',
        'zh-TW': '账户设置',
        'ja': 'アカウント設定'
      },
      profile: {
        'en': 'Profile',
        'zh-TW': '个人资料',
        'ja': 'プロフィール'
      },
      notifications: {
        'en': 'Notifications',
        'zh-TW': '通知设置',
        'ja': '通知設定'
      },
      security: {
        'en': 'Security',
        'zh-TW': '安全设置',
        'ja': 'セキュリティ'
      },
      billing: {
        'en': 'Billing',
        'zh-TW': '账单',
        'ja': '請求'
      },
      name: {
        'en': 'Full Name',
        'zh-TW': '姓名',
        'ja': '氏名'
      },
      email: {
        'en': 'Email Address',
        'zh-TW': '邮箱地址',
        'ja': 'メールアドレス'
      },
      phone: {
        'en': 'Phone Number',
        'zh-TW': '电话号码',
        'ja': '電話番号'
      },
      language: {
        'en': 'Language',
        'zh-TW': '语言',
        'ja': '言語'
      },
      saveChanges: {
        'en': 'Save Changes',
        'zh-TW': '保存更改',
        'ja': '変更を保存'
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
      marketingEmails: {
        'en': 'Marketing Emails',
        'zh-TW': '营销邮件',
        'ja': 'マーケティングメール'
      },
      restorationUpdates: {
        'en': 'Restoration Updates',
        'zh-TW': '修复更新',
        'ja': '復元更新'
      },
      changePassword: {
        'en': 'Change Password',
        'zh-TW': '修改密码',
        'ja': 'パスワード変更'
      },
      currentPassword: {
        'en': 'Current Password',
        'zh-TW': '当前密码',
        'ja': '現在のパスワード'
      },
      newPassword: {
        'en': 'New Password',
        'zh-TW': '新密码',
        'ja': '新しいパスワード'
      },
      confirmPassword: {
        'en': 'Confirm Password',
        'zh-TW': '确认密码',
        'ja': 'パスワード確認'
      },
      updatePassword: {
        'en': 'Update Password',
        'zh-TW': '更新密码',
        'ja': 'パスワード更新'
      },
      deleteAccount: {
        'en': 'Delete Account',
        'zh-TW': '删除账户',
        'ja': 'アカウント削除'
      },
      deleteAccountWarning: {
        'en': 'This action cannot be undone. All your data will be permanently deleted.',
        'zh-TW': '此操作无法撤销。您的所有数据将被永久删除。',
        'ja': 'この操作は取り消せません。すべてのデータが永久に削除されます。'
      },
      confirmDelete: {
        'en': 'Confirm Delete',
        'zh-TW': '确认删除',
        'ja': '削除確認'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Profile updated successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordChange = async () => {
    setIsLoading(true);
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Password updated successfully!');
      setIsLoading(false);
    }, 1000);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('name')}
        </label>
        <input
          type="text"
          value={profileData.name}
          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('email')}
        </label>
        <input
          type="email"
          value={profileData.email}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('phone')}
        </label>
        <input
          type="tel"
          value={profileData.phone}
          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('language')}
        </label>
        <select
          value={profileData.language}
          onChange={(e) => setProfileData({...profileData, language: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="zh-TW">繁體中文</option>
          <option value="ja">日本語</option>
        </select>
      </div>
      
      <button
        onClick={handleProfileSave}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : getAccountText('saveChanges')}
      </button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{getAccountText('emailNotifications')}</h3>
          <p className="text-sm text-gray-500">Receive email notifications about your account</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notificationSettings.emailNotifications}
            onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{getAccountText('pushNotifications')}</h3>
          <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notificationSettings.pushNotifications}
            onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{getAccountText('marketingEmails')}</h3>
          <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notificationSettings.marketingEmails}
            onChange={(e) => setNotificationSettings({...notificationSettings, marketingEmails: e.target.checked})}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{getAccountText('restorationUpdates')}</h3>
          <p className="text-sm text-gray-500">Get notified when your photo restoration is complete</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={notificationSettings.restorationUpdates}
            onChange={(e) => setNotificationSettings({...notificationSettings, restorationUpdates: e.target.checked})}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('currentPassword')}
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('newPassword')}
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getAccountText('confirmPassword')}
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        onClick={handlePasswordChange}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Updating...' : getAccountText('updatePassword')}
      </button>
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-red-600 mb-4">{getAccountText('deleteAccount')}</h3>
        <p className="text-sm text-gray-600 mb-4">{getAccountText('deleteAccountWarning')}</p>
        <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
          {getAccountText('confirmDelete')}
        </button>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Current Plan: Free</h3>
        <p className="text-blue-700">You are currently on the free plan with 5 restorations per month.</p>
        <button className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Upgrade Plan
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Billing History</h3>
        <p className="text-gray-600">No billing history available.</p>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{getAccountText('title')} - OldPho</title>
        <meta name="description" content="Account settings for OldPho" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={undefined} />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {getAccountText('title')}
              </h1>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                {message}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'profile', label: getAccountText('profile') },
                    { id: 'notifications', label: getAccountText('notifications') },
                    { id: 'security', label: getAccountText('security') },
                    { id: 'billing', label: getAccountText('billing') }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'billing' && renderBillingTab()}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Account; 