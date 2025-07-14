import { useEffect, useState } from 'react';

interface JankMetrics {
  frameRate: number;
  droppedFrames: number;
  longTasks: number;
  memoryUsage: number;
}

const JankDetector: React.FC = () => {
  const [metrics, setMetrics] = useState<JankMetrics>({
    frameRate: 0,
    droppedFrames: 0,
    longTasks: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let droppedFrames = 0;
    let longTasks = 0;

    // 帧率监控
    const measureFrameRate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime > 16.67) { // 60fps = 16.67ms per frame
        droppedFrames++;
      }
      
      frameCount++;
      lastTime = currentTime;
      
      const frameRate = 1000 / deltaTime;
      
      setMetrics(prev => ({
        ...prev,
        frameRate: Math.round(frameRate),
        droppedFrames
      }));
      
      requestAnimationFrame(measureFrameRate);
    };

    // 长任务检测
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // 50ms以上的任务
            longTasks++;
            console.warn('检测到卡顿:', {
              duration: entry.duration,
              name: entry.name,
              startTime: entry.startTime
            });
          }
        }
        
        setMetrics(prev => ({
          ...prev,
          longTasks
        }));
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }

    // 内存监控
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage
        }));

        if (memoryUsage > 100) { // 100MB警告
          console.warn('内存使用过高:', memoryUsage, 'MB');
        }
      }
    };

    // 启动监控
    requestAnimationFrame(measureFrameRate);
    const memoryInterval = setInterval(checkMemory, 5000);

    // 优化滚动性能
    const optimizeScroll = () => {
      let ticking = false;
      
      const updateScroll = () => {
        // 滚动优化逻辑
        ticking = false;
      };

      const requestTick = () => {
        if (!ticking) {
          requestAnimationFrame(updateScroll);
          ticking = true;
        }
      };

      window.addEventListener('scroll', requestTick, { passive: true });
    };

    // 优化点击响应
    const optimizeClicks = () => {
      const buttons = document.querySelectorAll('button, [role="button"], a');
      
      buttons.forEach(element => {
        // 添加触摸反馈
        element.addEventListener('touchstart', () => {
          (element as HTMLElement).style.transform = 'scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
          (element as HTMLElement).style.transform = '';
        }, { passive: true });

        // 防抖点击
        let clickTimeout: number;
        element.addEventListener('click', (e) => {
          if (clickTimeout) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          
          clickTimeout = window.setTimeout(() => {
            clickTimeout = 0;
          }, 300);
        });
      });
    };

    // 优化图片加载
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        // 添加懒加载
        if (!img.loading) {
          img.loading = 'lazy';
        }
        
        // 优化图片尺寸
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          const containerWidth = img.parentElement?.clientWidth || 0;
          if (containerWidth > 0 && img.naturalWidth > containerWidth * 2) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          }
        }
      });
    };

    // 执行优化
    optimizeScroll();
    optimizeClicks();
    optimizeImages();

    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  // 性能报告
  useEffect(() => {
    const reportPerformance = () => {
      if (metrics.droppedFrames > 10 || metrics.longTasks > 5) {
        console.warn('检测到性能问题:', metrics);
        
        // 发送性能报告
        fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'jank_report',
            metrics,
            timestamp: Date.now(),
            url: window.location.href
          })
        }).catch(console.error);
      }
    };

    const reportInterval = setInterval(reportPerformance, 10000); // 每10秒报告一次

    return () => clearInterval(reportInterval);
  }, [metrics]);

  return null; // 无渲染组件
};

export default JankDetector; 