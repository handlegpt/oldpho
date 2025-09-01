import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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
  originalImage: string;
  restoredImage: string;
  fileName: string;
  originalSize: number;
  restoredSize: number;
  totalSize: number;
  status: string;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
}

const Gallery: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processed' | 'unprocessed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/restore');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchGallery = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          setLoading(true);
          const response = await fetch('/api/gallery');
          if (response.ok) {
            const data = await response.json();
            setGalleryItems(data);
          } else {
            console.error('Failed to fetch gallery:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching gallery:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGallery();
  }, [status, session]);

  const handleLanguageChange = (language: Language) => {
    console.log('Language changed to:', language);
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev: string[]) => 
      prev.includes(itemId) 
        ? prev.filter((id: string) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === galleryItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(galleryItems.map((item: GalleryItem) => item.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;

    if (!confirm(currentLanguage === 'zh-TW' ? '确定要删除选中的照片吗？' :
                currentLanguage === 'ja' ? '選択した写真を削除しますか？' :
                'Are you sure you want to delete the selected photos?')) {
      return;
    }

    try {
      await Promise.all(
        selectedItems.map(async (itemId: string) => {
          const response = await fetch('/api/gallery/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ restorationId: itemId }),
          });

          if (!response.ok) {
            throw new Error(`Failed to delete item ${itemId}`);
          }
        })
      );

      setGalleryItems((prev: GalleryItem[]) => prev.filter((item: GalleryItem) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error deleting items:', error);
      alert(currentLanguage === 'zh-TW' ? '删除失败，请重试' :
            currentLanguage === 'ja' ? '削除に失敗しました。もう一度お試しください' :
            'Failed to delete some items. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLanguage === 'zh-TW' ? 'zh-TW' : currentLanguage === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGalleryText = (key: string) => {
    const texts = {
      title: {
        'en': 'Photo Gallery',
        'zh-TW': '照片库',
        'ja': '写真ギャラリー'
      },
      subtitle: {
        'en': 'Manage your restored photos',
        'zh-TW': '管理您修复的照片',
        'ja': '修復した写真を管理'
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
      },
      all: {
        'en': 'All',
        'zh-TW': '全部',
        'ja': 'すべて'
      },
      sortBy: {
        'en': 'Sort by',
        'zh-TW': '排序方式',
        'ja': '並び替え'
      },
      date: {
        'en': 'Date',
        'zh-TW': '日期',
        'ja': '日付'
      },
      name: {
        'en': 'Name',
        'zh-TW': '名称',
        'ja': '名前'
      },
      size: {
        'en': 'Size',
        'zh-TW': '大小',
        'ja': 'サイズ'
      },
      viewMode: {
        'en': 'View Mode',
        'zh-TW': '查看模式',
        'ja': '表示モード'
      },
      grid: {
        'en': 'Grid',
        'zh-TW': '网格',
        'ja': 'グリッド'
      },
      list: {
        'en': 'List',
        'zh-TW': '列表',
        'ja': 'リスト'
      },
      masonry: {
        'en': 'Masonry',
        'zh-TW': '瀑布流',
        'ja': 'メーソンリー'
      },
      original: {
        'en': 'Original',
        'zh-TW': '原始',
        'ja': '元の画像'
      },
      restored: {
        'en': 'Restored',
        'zh-TW': '修复后',
        'ja': '修復後'
      },
      fileInfo: {
        'en': 'File Info',
        'zh-TW': '文件信息',
        'ja': 'ファイル情報'
      },
      processingTime: {
        'en': 'Processing Time',
        'zh-TW': '处理时间',
        'ja': '処理時間'
      },
      close: {
        'en': 'Close',
        'zh-TW': '关闭',
        'ja': '閉じる'
      }
    };
    return texts[key as keyof typeof texts]?.[currentLanguage] || texts[key as keyof typeof texts]?.['en'] || '';
  };

  const filteredAndSortedItems = galleryItems
    .filter(item => {
      if (filterStatus === 'all') return true;
      return item.status === filterStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'name':
          comparison = a.fileName.localeCompare(b.fileName);
          break;
        case 'size':
          comparison = a.totalSize - b.totalSize;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <>
      <Head>
        <title>{getGalleryText('title')} - Shin AI</title>
        <meta name="description" content="Manage your restored photos" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header photo={session?.user?.image || undefined} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {getGalleryText('title')}
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {getGalleryText('subtitle')}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">🖼️</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Controls Section */}
            <section className="mb-8">
              <AnimatedCard>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-strong border border-white/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      {/* Filter */}
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          {currentLanguage === 'zh-TW' ? '筛选' :
                           currentLanguage === 'ja' ? 'フィルター' :
                           'Filter'}:
                        </label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value as any)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">{getGalleryText('all')}</option>
                          <option value="processed">{getGalleryText('processed')}</option>
                          <option value="unprocessed">{getGalleryText('unprocessed')}</option>
                        </select>
                      </div>

                      {/* Sort */}
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          {getGalleryText('sortBy')}:
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="date">{getGalleryText('date')}</option>
                          <option value="name">{getGalleryText('name')}</option>
                          <option value="size">{getGalleryText('size')}</option>
                        </select>
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                      </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-4">
                      {/* View Mode */}
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          {getGalleryText('viewMode')}:
                        </label>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                          {(['grid', 'list', 'masonry'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setViewMode(mode)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-medium ${
                                viewMode === mode
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {getGalleryText(mode)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Bulk Actions */}
                      {selectedItems.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleDeleteSelected}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-medium"
                          >
                            {getGalleryText('deleteSelected')} ({selectedItems.length})
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Select All */}
                  {galleryItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === galleryItems.length}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {getGalleryText('selectAll')}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            </section>

            {/* Gallery Content */}
            <section>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : filteredAndSortedItems.length === 0 ? (
                <AnimatedCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-strong border border-white/50">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-gray-400 text-4xl">📸</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {getGalleryText('noPhotos')}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {currentLanguage === 'zh-TW' ? '开始上传和修复您的第一张照片' :
                       currentLanguage === 'ja' ? '最初の写真をアップロードして修復を開始' :
                       'Start by uploading and restoring your first photo'}
                    </p>
                    <Link
                      href="/restore"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-medium"
                    >
                      <span className="mr-2">📸</span>
                      {getGalleryText('uploadPhotos')}
                    </Link>
                  </div>
                </AnimatedCard>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                  viewMode === 'list' ? 'grid-cols-1' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {filteredAndSortedItems.map((item) => (
                    <AnimatedCard key={item.id}>
                      <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-strong border border-white/50 overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}>
                        {/* Image Section */}
                        <div className={`relative ${
                          viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-square'
                        }`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-2xl">🖼️</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {currentLanguage === 'zh-TW' ? '点击查看' :
                                 currentLanguage === 'ja' ? 'クリックして表示' :
                                 'Click to view'}
                              </p>
                            </div>
                          </div>
                          
                          {/* Checkbox */}
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.status === 'processed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {getGalleryText(item.status as any)}
                            </span>
                          </div>
                        </div>

                        {/* Info Section */}
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 truncate">
                            {item.fileName}
                          </h3>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>{currentLanguage === 'zh-TW' ? '大小' : currentLanguage === 'ja' ? 'サイズ' : 'Size'}:</span>
                              <span>{formatFileSize(item.totalSize)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{currentLanguage === 'zh-TW' ? '日期' : currentLanguage === 'ja' ? '日付' : 'Date'}:</span>
                              <span>{formatDate(item.createdAt)}</span>
                            </div>
                            {item.processingTime && (
                              <div className="flex justify-between">
                                <span>{getGalleryText('processingTime')}:</span>
                                <span>{item.processingTime}s</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 mt-4">
                            <button
                              onClick={() => handleItemClick(item)}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-medium"
                            >
                              {currentLanguage === 'zh-TW' ? '查看' :
                               currentLanguage === 'ja' ? '表示' :
                               'View'}
                            </button>
                            <button
                              onClick={() => downloadImage(item.restoredImage, `restored_${item.fileName}`)}
                              className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-medium"
                            >
                              {getGalleryText('download')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>

        {/* Modal for Image Comparison */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedItem.fileName}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">
                      {getGalleryText('original')}
                    </h4>
                    <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">📷</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(selectedItem.originalSize)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Restored Image */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">
                      {getGalleryText('restored')}
                    </h4>
                    <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl">✨</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {formatFileSize(selectedItem.restoredSize)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {getGalleryText('fileInfo')}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{currentLanguage === 'zh-TW' ? '文件名' : currentLanguage === 'ja' ? 'ファイル名' : 'Filename'}:</span>
                      <p className="font-medium">{selectedItem.fileName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{currentLanguage === 'zh-TW' ? '总大小' : currentLanguage === 'ja' ? '総サイズ' : 'Total Size'}:</span>
                      <p className="font-medium">{formatFileSize(selectedItem.totalSize)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">{currentLanguage === 'zh-TW' ? '创建时间' : currentLanguage === 'ja' ? '作成日時' : 'Created'}:</span>
                      <p className="font-medium">{formatDate(selectedItem.createdAt)}</p>
                    </div>
                    {selectedItem.processingTime && (
                      <div>
                        <span className="text-gray-600">{getGalleryText('processingTime')}:</span>
                        <p className="font-medium">{selectedItem.processingTime}s</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    onClick={() => downloadImage(selectedItem.restoredImage, `restored_${selectedItem.fileName}`)}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-medium"
                  >
                    {getGalleryText('download')}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-medium"
                  >
                    {getGalleryText('close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Gallery; 