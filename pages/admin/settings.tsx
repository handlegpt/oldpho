import { NextPage } from 'next';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';

interface SystemSettings {
  maxFileSize: number;
  maxRestorationsPerDay: number;
  enableEmailNotifications: boolean;
  enableMaintenanceMode: boolean;
  apiRateLimit: number;
  storageLimit: number;
}

const AdminSettings: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<SystemSettings>({
    maxFileSize: 10,
    maxRestorationsPerDay: 10,
    enableEmailNotifications: true,
    enableMaintenanceMode: false,
    apiRateLimit: 100,
    storageLimit: 1000
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && session?.user) {
      checkAdminAccess();
    }
  }, [status, session, router]);

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.status === 403) {
        console.log('Access denied: User is not admin');
        router.push('/dashboard');
        return;
      } else if (response.ok) {
        setIsAdmin(true);
        fetchSettings();
      } else {
        console.error('Failed to check admin access:', response.statusText);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/dashboard');
    }
  };

  const fetchSettings = async () => {
    try {
      // 这里可以添加获取设置的API调用
      // const response = await fetch('/api/admin/settings');
      // if (response.ok) {
      //   const data = await response.json();
      //   setSettings(data);
      // }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      // 这里可以添加保存设置的API调用
      // const response = await fetch('/api/admin/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      // if (response.ok) {
      //   setMessage('Settings saved successfully!');
      // } else {
      //   setMessage('Failed to save settings');
      // }
      
      // 模拟保存成功
      setTimeout(() => {
        setMessage('Settings saved successfully!');
        setSaving(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" color="blue" text="Loading..." />
        </div>
      </div>
    );
  }

  if (!session?.user || !isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>System Settings - Admin Dashboard</title>
        <meta name="description" content="System settings and configuration" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                  <p className="text-gray-600 mt-2">Configure system-wide settings and preferences</p>
                </div>
                <Link href="/admin" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Settings Form */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="space-y-6">
                  {/* File Upload Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">File Upload Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum File Size (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.maxFileSize}
                          onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                          max="50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Storage Limit (MB)
                        </label>
                        <input
                          type="number"
                          value={settings.storageLimit}
                          onChange={(e) => setSettings({...settings, storageLimit: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="100"
                          max="10000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* User Limits */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Restorations Per Day
                        </label>
                        <input
                          type="number"
                          value={settings.maxRestorationsPerDay}
                          onChange={(e) => setSettings({...settings, maxRestorationsPerDay: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Rate Limit (requests/hour)
                        </label>
                        <input
                          type="number"
                          value={settings.apiRateLimit}
                          onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="10"
                          max="1000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* System Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Options</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Enable Email Notifications</label>
                          <p className="text-sm text-gray-500">Send email notifications for system events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableEmailNotifications}
                            onChange={(e) => setSettings({...settings, enableEmailNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                          <p className="text-sm text-gray-500">Temporarily disable user access for maintenance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.enableMaintenanceMode}
                            onChange={(e) => setSettings({...settings, enableMaintenanceMode: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {message}
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end space-x-4">
                    <Link href="/admin" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default AdminSettings;
