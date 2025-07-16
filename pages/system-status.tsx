import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

interface QueueStatus {
  queueLength: number;
  currentConcurrent: number;
  maxConcurrent: number;
  processing: boolean;
}

interface ProviderStats {
  success: number;
  failure: number;
  totalCost: number;
  successRate: string;
}

interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  totalCost: number;
  averageAccessTime: number;
}

interface SystemStatus {
  queue: QueueStatus;
  providers: {
    stats: Record<string, ProviderStats>;
    available: Array<{
      name: string;
      priority: number;
      costPerRequest: number;
      rateLimit: number;
    }>;
  };
  cache: CacheStats;
  timestamp: string;
}

const SystemStatus: NextPage = () => {
  const { data: session, status } = useSession();
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    const fetchSystemStatus = async () => {
      try {
        const response = await fetch('/api/system-status');
        if (!response.ok) {
          throw new Error('Failed to fetch system status');
        }
        const data = await response.json();
        setSystemStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSystemStatus();
    
    // 每30秒刷新一次
    const interval = setInterval(fetchSystemStatus, 30000);
    return () => clearInterval(interval);
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading system status...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to view system status.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Data</h1>
          <p className="text-gray-600">System status data not available.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>System Status - OldPho</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            <p className="text-gray-600 mt-2">
              Last updated: {new Date(systemStatus.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queue Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Queue Length:</span>
                  <span className="font-medium">{systemStatus.queue.queueLength}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Concurrent:</span>
                  <span className="font-medium">{systemStatus.queue.currentConcurrent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Concurrent:</span>
                  <span className="font-medium">{systemStatus.queue.maxConcurrent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing:</span>
                  <span className={`font-medium ${systemStatus.queue.processing ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.queue.processing ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Provider Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Provider Statistics</h2>
              <div className="space-y-4">
                {Object.entries(systemStatus.providers.stats).map(([name, stats]) => (
                  <div key={name} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h3 className="font-medium text-gray-900 capitalize">{name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">Success:</span>
                        <span className="ml-1 font-medium text-green-600">{stats.success}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Failure:</span>
                        <span className="ml-1 font-medium text-red-600">{stats.failure}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="ml-1 font-medium">{stats.successRate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Cost:</span>
                        <span className="ml-1 font-medium">${stats.totalCost.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cache Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cache Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{systemStatus.cache.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Size:</span>
                  <span className="font-medium">{systemStatus.cache.maxSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hit Rate:</span>
                  <span className="font-medium">{systemStatus.cache.hitRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hits:</span>
                  <span className="font-medium">{systemStatus.cache.totalHits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Misses:</span>
                  <span className="font-medium">{systemStatus.cache.totalMisses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">${systemStatus.cache.totalCost.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Providers */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemStatus.providers.available.map((provider) => (
                <div key={provider.name} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 capitalize mb-2">{provider.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <span className="font-medium">{provider.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost/Request:</span>
                      <span className="font-medium">${provider.costPerRequest.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate Limit:</span>
                      <span className="font-medium">{provider.rateLimit}/min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {systemStatus.cache.hitRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Cache Hit Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  ${systemStatus.cache.totalCost.toFixed(4)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Cost Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {systemStatus.queue.queueLength}
                </div>
                <div className="text-sm text-gray-600 mt-1">Pending Tasks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SystemStatus; 