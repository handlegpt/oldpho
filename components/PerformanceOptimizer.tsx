import { useEffect, useState } from 'react';
import { resourcePreloader, smartCache } from '../utils/performance';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  domLoad: number; // DOM Content Loaded
  windowLoad: number; // Window Load
}

const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // 预加载关键资源
    const preloadResources = async () => {
      try {
        await resourcePreloader.preloadCriticalResources();
        console.log('关键资源预加载完成');
      } catch (error) {
        console.warn('资源预加载失败:', error);
      }
    };

    preloadResources();

    // 监控核心 Web 指标
    if ('PerformanceObserver' in window) {
      const observers: PerformanceObserver[] = [];

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
          ttfb: prev?.ttfb || 0,
          domLoad: prev?.domLoad || 0,
          windowLoad: prev?.windowLoad || 0
        }));
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      observers.push(fcpObserver);

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
          ttfb: prev?.ttfb || 0,
          domLoad: prev?.domLoad || 0,
          windowLoad: prev?.windowLoad || 0
        }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      observers.push(lcpObserver);

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
          ttfb: prev?.ttfb || 0,
          domLoad: prev?.domLoad || 0,
          windowLoad: prev?.windowLoad || 0
        }));
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      observers.push(fidObserver);

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
          ttfb: prev?.ttfb || 0,
          domLoad: prev?.domLoad || 0,
          windowLoad: prev?.windowLoad || 0
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      observers.push(clsObserver);

      // 清理观察器
      return () => {
        observers.forEach(observer => observer.disconnect());
      };
    }

    // 获取导航时间指标
    const getNavigationMetrics = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
          domLoad: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
          windowLoad: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
          fcp: prev?.fcp || 0,
          lcp: prev?.lcp || 0,
          fid: prev?.fid || 0,
          cls: prev?.cls || 0
        }));
      }
    };

    // 延迟获取导航指标，确保所有指标都已收集
    const timer = setTimeout(getNavigationMetrics, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 性能优化建议
  useEffect(() => {
    if (metrics) {
      const optimizations: string[] = [];

      if (metrics.fcp > 2000) {
        optimizations.push('首屏内容绘制时间过长，建议优化关键资源加载');
      }

      if (metrics.lcp > 2500) {
        optimizations.push('最大内容绘制时间过长，建议优化图片和字体加载');
      }

      if (metrics.fid > 100) {
        optimizations.push('首次输入延迟过高，建议优化JavaScript执行');
      }

      if (metrics.cls > 0.1) {
        optimizations.push('累积布局偏移过高，建议优化页面布局');
      }

      if (optimizations.length > 0) {
        console.warn('性能优化建议:', optimizations);
      } else {
        setIsOptimized(true);
      }

      // 发送性能数据到分析服务
      sendPerformanceData(metrics);
    }
  }, [metrics]);

  const sendPerformanceData = async (data: PerformanceMetrics) => {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.warn('性能数据发送失败:', error);
    }
  };

  // 优化按钮点击响应
  useEffect(() => {
    const optimizeButtonClicks = () => {
      // 为所有按钮添加触摸优化
      const buttons = document.querySelectorAll('button, [role="button"]');
      buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
          button.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        button.addEventListener('touchend', () => {
          button.style.transform = '';
        }, { passive: true });
      });
    };

    // 延迟执行，确保DOM已加载
    const timer = setTimeout(optimizeButtonClicks, 100);
    return () => clearTimeout(timer);
  }, []);

  return null; // 这是一个无渲染组件
};

export default PerformanceOptimizer; 