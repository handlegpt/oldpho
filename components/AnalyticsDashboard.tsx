import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Language } from '../types/language';

interface AnalyticsData {
  totalRestorations: number;
  successfulRestorations: number;
  failedRestorations: number;
  averageProcessingTime: number;
  monthlyUsage: {
    month: string;
    count: number;
  }[];
  qualityDistribution: {
    quality: string;
    count: number;
  }[];
  popularFeatures: {
    feature: string;
    usage: number;
  }[];
}

interface AnalyticsDashboardProps {
  currentLanguage: Language;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ currentLanguage }) => {
  const { data: session } = useSession();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRestorations: 0,
    successfulRestorations: 0,
    failedRestorations: 0,
    averageProcessingTime: 0,
    monthlyUsage: [],
    qualityDistribution: [],
    popularFeatures: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalyticsData({
        totalRestorations: 156,
        successfulRestorations: 142,
        failedRestorations: 14,
        averageProcessingTime: 45.2,
        monthlyUsage: [
          { month: 'Jan', count: 12 },
          { month: 'Feb', count: 18 },
          { month: 'Mar', count: 25 },
          { month: 'Apr', count: 22 },
          { month: 'May', count: 30 },
          { month: 'Jun', count: 28 }
        ],
        qualityDistribution: [
          { quality: 'Standard', count: 45 },
          { quality: 'High', count: 67 },
          { quality: 'Ultra', count: 44 }
        ],
        popularFeatures: [
          { feature: 'Face Restoration', usage: 89 },
          { feature: 'Color Enhancement', usage: 67 },
          { feature: 'Noise Reduction', usage: 45 },
          { feature: 'Detail Enhancement', usage: 34 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const successRate = analyticsData.totalRestorations > 0 
    ? ((analyticsData.successfulRestorations / analyticsData.totalRestorations) * 100).toFixed(1)
    : '0';

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">
        {currentLanguage === 'zh-TW' ? '使用分析' : currentLanguage === 'ja' ? '使用分析' : 'Usage Analytics'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Restorations */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{analyticsData.totalRestorations}</div>
          <div className="text-sm text-blue-700">
            {currentLanguage === 'zh-TW' ? '总修复次数' : currentLanguage === 'ja' ? '総復元回数' : 'Total Restorations'}
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{successRate}%</div>
          <div className="text-sm text-green-700">
            {currentLanguage === 'zh-TW' ? '成功率' : currentLanguage === 'ja' ? '成功率' : 'Success Rate'}
          </div>
        </div>

        {/* Average Processing Time */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{analyticsData.averageProcessingTime}s</div>
          <div className="text-sm text-purple-700">
            {currentLanguage === 'zh-TW' ? '平均处理时间' : currentLanguage === 'ja' ? '平均処理時間' : 'Avg Processing Time'}
          </div>
        </div>

        {/* Failed Restorations */}
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{analyticsData.failedRestorations}</div>
          <div className="text-sm text-red-700">
            {currentLanguage === 'zh-TW' ? '失败次数' : currentLanguage === 'ja' ? '失敗回数' : 'Failed Restorations'}
          </div>
        </div>
      </div>

      {/* Monthly Usage Chart */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          {currentLanguage === 'zh-TW' ? '月度使用趋势' : currentLanguage === 'ja' ? '月次使用傾向' : 'Monthly Usage Trend'}
        </h4>
        <div className="flex items-end space-x-2 h-32">
          {analyticsData.monthlyUsage.map((item, index) => {
            const maxCount = Math.max(...analyticsData.monthlyUsage.map(m => m.count));
            const height = (item.count / maxCount) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                <div className="text-xs text-gray-500">{item.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quality Distribution */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">
          {currentLanguage === 'zh-TW' ? '质量分布' : currentLanguage === 'ja' ? '品質分布' : 'Quality Distribution'}
        </h4>
        <div className="space-y-2">
          {analyticsData.qualityDistribution.map((item, index) => {
            const total = analyticsData.qualityDistribution.reduce((sum, q) => sum + q.count, 0);
            const percentage = ((item.count / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.quality}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Features */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">
          {currentLanguage === 'zh-TW' ? '热门功能' : currentLanguage === 'ja' ? '人気機能' : 'Popular Features'}
        </h4>
        <div className="space-y-2">
          {analyticsData.popularFeatures.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">{item.feature}</span>
              <span className="text-sm font-medium text-gray-900">{item.usage}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 