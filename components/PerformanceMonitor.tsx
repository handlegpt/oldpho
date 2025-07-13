import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // 监控核心 Web 指标
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        setMetrics(prev => ({ 
          ...prev, 
          fcp: fcp.startTime,
          lcp: prev?.lcp || 0,
          fid: prev?.fid || 0,
          cls: prev?.cls || 0,
          ttfb: prev?.ttfb || 0
        }));
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        setMetrics(prev => ({ 
          ...prev, 
          lcp: lcp.startTime,
          fcp: prev?.fcp || 0,
          fid: prev?.fid || 0,
          cls: prev?.cls || 0,
          ttfb: prev?.ttfb || 0
        }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[0];
        const processingStart = (fid as any).processingStart || 0;
        const startTime = fid.startTime || 0;
        setMetrics(prev => ({ 
          ...prev, 
          fid: processingStart - startTime,
          fcp: prev?.fcp || 0,
          lcp: prev?.lcp || 0,
          cls: prev?.cls || 0,
          ttfb: prev?.ttfb || 0
        }));
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value || 0;
          }
        }
        setMetrics(prev => ({ 
          ...prev, 
          cls,
          fcp: prev?.fcp || 0,
          lcp: prev?.lcp || 0,
          fid: prev?.fid || 0,
          ttfb: prev?.ttfb || 0
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ 
        ...prev, 
        ttfb,
        fcp: prev?.fcp || 0,
        lcp: prev?.lcp || 0,
        fid: prev?.fid || 0,
        cls: prev?.cls || 0
      }));
    }

    // 发送性能数据到分析服务
    const sendMetrics = () => {
      if (metrics) {
        // 这里可以发送到 Google Analytics 或其他分析服务
        console.log('Performance Metrics:', metrics);
        
        // 示例：发送到自定义端点
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metrics)
        }).catch(console.error);
      }
    };

    // 页面卸载时发送数据
    window.addEventListener('beforeunload', sendMetrics);

    return () => {
      window.removeEventListener('beforeunload', sendMetrics);
    };
  }, [metrics]);

  return null; // 这是一个无渲染组件
};

export default PerformanceMonitor; 