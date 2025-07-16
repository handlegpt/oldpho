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
import { Language } from '../types/language';
import Image from 'next/image';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  originalImage: string;
  restoredImage: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  fileName: string;
}

const History: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  useEffect(() => {
    // 模拟加载历史记录
    setTimeout(() => {
      const mockHistory: HistoryItem[] = [
        {
          id: '1',
          originalImage: '/sample-original-1.jpg',
          restoredImage: '/sample-restored-1.jpg',
          createdAt: '2024-01-15T10:30:00Z',
          status: 'completed',
          fileName: 'family_photo_1920.jpg'
        },
        {
          id: '2',
          originalImage: '/sample-original-2.jpg',
          restoredImage: '/sample-restored-2.jpg',
          createdAt: '2024-01-14T15:45:00Z',
          status: 'completed',
          fileName: 'grandparents_photo.jpg'
        },
        {
          id: '3',
          originalImage: '/sample-original-3.jpg',
          restoredImage: '/sample-restored-3.jpg',
          createdAt: '2024-01-13T09:20:00Z',
          status: 'processing',
          fileName: 'old_portrait.jpg'
        }
      ];
      setHistoryItems(mockHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLanguageChange = (language: Language) => {
    // Language change is now handled by the global context
    console.log('Language changed to:', language);
  };

  const filteredItems = historyItems.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getHistoryText = (key: string) => {
    const texts = {
      title: {
        'en': 'Restoration History',
        'zh-TW': '修复历史',
        'ja': '復元履歴'
      },
      subtitle: {
        'en': 'View your photo restoration history',
        'zh-TW': '查看您的照片修复历史',
        'ja': '写真復元履歴を確認'
      },
      noHistory: {
        'en': 'No restoration history yet',
        'zh-TW': '暂无修复历史',
        'ja': '復元履歴がありません'
      },
      filterAll: {
        'en': 'All',
        'zh-TW': '全部',
        'ja': 'すべて'
      },
      filterCompleted: {
        'en': 'Completed',
        'zh-TW': '已完成',
        'ja': '完了'
      },
      filterProcessing: {
        'en': 'Processing',
        'zh-TW': '处理中',
        'ja': '処理中'
      },
      filterFailed: {
        'en': 'Failed',
        'zh-TW': '失败',
        'ja': '失敗'
      },
      download: {
        'en': 'Download',
        'zh-TW': '下载',
        'ja': 'ダウンロード'
      },
      viewDetails: {
        'en': 'View Details',
        'zh-TW': '查看详情',
        'ja': '詳細を見る'
      },
      original: {
        'en': 'Original',
        'zh-TW': '原图',
        'ja': '元画像'
      },
      restored: {
        'en': 'Restored',
        'zh-TW': '修复后',
        'ja': '復元後'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      completed: {
        'en': 'Completed',
        'zh-TW': '已完成',
        'ja': '完了'
      },
      processing: {
        'en': 'Processing',
        'zh-TW': '处理中',
        'ja': '処理中'
      },
      failed: {
        'en': 'Failed',
        'zh-TW': '失败',
        'ja': '失敗'
      }
    };
    return statusTexts[status as keyof typeof statusTexts]?.[currentLanguage] || statusTexts[status as keyof typeof statusTexts]?.['en'] || '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Head>
        <title>History - OldPho</title>
        <meta name="description" content="Your photo restoration history" />
      </Head>
      
      <Header />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {getHistoryText('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {getHistoryText('subtitle')}
            </p>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {(['all', 'completed', 'processing', 'failed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getHistoryText(`filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* History Items */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" color="blue" text="Loading history..." />
            </div>
          ) : filteredItems.length === 0 ? (
            <AnimatedCard className="p-12 text-center">
              <div className="text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">{getHistoryText('noHistory')}</p>
                <Link
                  href="/restore"
                  className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {currentLanguage === 'zh-TW' ? '开始修复照片' : currentLanguage === 'ja' ? '写真復元を開始' : 'Start Restoring Photos'}
                </Link>
              </div>
            </AnimatedCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <AnimatedCard key={item.id} className="p-6">
                  <div className="space-y-4">
                    {/* Images */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                          <Image
                            src={item.originalImage}
                            alt="Original"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500">{getHistoryText('original')}</p>
                      </div>
                      <div className="text-center">
                        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                          <Image
                            src={item.restoredImage}
                            alt="Restored"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-500">{getHistoryText('restored')}</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <p className="font-medium text-sm truncate">{item.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        {getHistoryText('download')}
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        {getHistoryText('viewDetails')}
                      </button>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History; 