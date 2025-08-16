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

interface GalleryItem {
  id: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isProcessed: boolean;
  restoredImageUrl?: string;
}

const Gallery: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  useEffect(() => {
    // 模拟加载照片库
    setTimeout(() => {
      const mockGallery: GalleryItem[] = [
        {
          id: '1',
          imageUrl: '/sample-original-1.jpg',
          fileName: 'family_photo_1920.jpg',
          fileSize: 2048576, // 2MB
          uploadedAt: '2024-01-15T10:30:00Z',
          isProcessed: true,
          restoredImageUrl: '/sample-restored-1.jpg'
        },
        {
          id: '2',
          imageUrl: '/sample-original-2.jpg',
          fileName: 'grandparents_photo.jpg',
          fileSize: 1536000, // 1.5MB
          uploadedAt: '2024-01-14T15:45:00Z',
          isProcessed: true,
          restoredImageUrl: '/sample-restored-2.jpg'
        },
        {
          id: '3',
          imageUrl: '/sample-original-3.jpg',
          fileName: 'old_portrait.jpg',
          fileSize: 3072000, // 3MB
          uploadedAt: '2024-01-13T09:20:00Z',
          isProcessed: false
        }
      ];
      setGalleryItems(mockGallery);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLanguageChange = (language: Language) => {
    // Language change is now handled by the global context
    console.log('Language changed to:', language);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === galleryItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(galleryItems.map(item => item.id));
    }
  };

  const handleDeleteSelected = () => {
    setGalleryItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getGalleryText = (key: string) => {
    const texts = {
      title: {
        'en': 'Photo Gallery',
        'zh-TW': '照片库',
        'ja': '写真ギャラリー'
      },
      subtitle: {
        'en': 'Manage your uploaded photos',
        'zh-TW': '管理您上传的照片',
        'ja': 'アップロードした写真を管理'
      },
      noPhotos: {
        'en': 'No photos uploaded yet',
        'zh-TW': '暂无上传的照片',
        'ja': 'アップロードされた写真がありません'
      },
      uploadPhotos: {
        'en': 'Upload Photos',
        'zh-TW': '上传照片',
        'ja': '写真をアップロード'
      },
      selectAll: {
        'en': 'Select All',
        'zh-TW': '全选',
        'ja': 'すべて選択'
      },
      deleteSelected: {
        'en': 'Delete Selected',
        'zh-TW': '删除选中',
        'ja': '選択したものを削除'
      },
      restore: {
        'en': 'Restore',
        'zh-TW': '修复',
        'ja': '復元'
      },
      download: {
        'en': 'Download',
        'zh-TW': '下载',
        'ja': 'ダウンロード'
      },
      delete: {
        'en': 'Delete',
        'zh-TW': '删除',
        'ja': '削除'
      },
      processed: {
        'en': 'Processed',
        'zh-TW': '已处理',
        'ja': '処理済み'
      },
      unprocessed: {
        'en': 'Unprocessed',
        'zh-TW': '未处理',
        'ja': '未処理'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
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
        <title>Gallery - Shin AI</title>
        <meta name="description" content="Manage your photo gallery" />
      </Head>
      
      <Header />
      
      <main className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {getGalleryText('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {getGalleryText('subtitle')}
            </p>
          </div>

          {/* Actions */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                {getGalleryText('selectAll')}
              </button>
              {selectedItems.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  {getGalleryText('deleteSelected')} ({selectedItems.length})
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Gallery Items */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" color="blue" text="Loading gallery..." />
            </div>
          ) : galleryItems.length === 0 ? (
            <AnimatedCard className="p-12 text-center">
              <div className="text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">{getGalleryText('noPhotos')}</p>
                <button className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  {getGalleryText('uploadPhotos')}
                </button>
              </div>
            </AnimatedCard>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {galleryItems.map((item) => (
                <AnimatedCard key={item.id} className={`p-4 ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}`}>
                  <div className={viewMode === 'list' ? 'flex items-center space-x-4 flex-1' : 'space-y-4'}>
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />

                    {/* Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-20 h-20' : 'aspect-square'} bg-gray-100 rounded-lg overflow-hidden`}>
                      <Image
                        src={item.imageUrl}
                        alt={item.fileName}
                        fill
                        className="object-cover"
                      />
                      {item.isProcessed && (
                        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                          {getGalleryText('processed')}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className={viewMode === 'list' ? 'flex-1' : 'space-y-2'}>
                      <p className="font-medium text-sm truncate">{item.fileName}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(item.fileSize)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </p>
                      {!item.isProcessed && (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {getGalleryText('unprocessed')}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={viewMode === 'list' ? 'flex space-x-2' : 'flex space-x-2 mt-4'}>
                      {!item.isProcessed && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors">
                          {getGalleryText('restore')}
                        </button>
                      )}
                      {item.isProcessed && (
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition-colors">
                          {getGalleryText('download')}
                        </button>
                      )}
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors">
                        {getGalleryText('delete')}
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

export default Gallery; 