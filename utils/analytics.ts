export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  // 简单的分析追踪
  console.log('Analytics Event:', eventName, properties);
  
  // 可以集成 Google Analytics 或其他分析服务
  if (window.gtag) {
    window.gtag('event', eventName, properties || {});
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_name: pageName });
};

export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', { language });
};

export const trackPhotoUpload = () => {
  trackEvent('photo_upload');
};

export const trackPhotoRestore = () => {
  trackEvent('photo_restore');
};

export const trackDownload = () => {
  trackEvent('photo_download');
};

// 性能监控
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`Performance [${name}]: ${end - start}ms`);
  
  // 可以发送到分析服务
  trackEvent('performance_measure', {
    name,
    duration: end - start
  });
}; 