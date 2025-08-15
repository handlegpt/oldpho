const CACHE_NAME = 'oldpho-v1.0.1';
const STATIC_CACHE = 'static-v1.1';
const DYNAMIC_CACHE = 'dynamic-v1.1';

const STATIC_ASSETS = [
  '/',
  '/restore',
  '/static/css/globals.css',
  '/favicon.ico',
  '/manifest.json'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过API请求
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 静态资源缓存策略
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else {
    // 动态内容网络优先策略
    event.respondWith(networkFirst(request));
  }
});

// 判断是否为静态资源
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
         pathname === '/' ||
         pathname === '/restore' ||
         pathname.startsWith('/static/');
}

// 缓存优先策略
async function cacheFirst(request) {
  try {
    // 跳过不支持的URL scheme
    const url = new URL(request.url);
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:' || url.protocol === 'ms-browser-extension:') {
      return fetch(request);
    }
    
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Cache first failed:', error);
    return fetch(request);
  }
}

// 网络优先策略
async function networkFirst(request) {
  try {
    // 跳过不支持的URL scheme
    const url = new URL(request.url);
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:' || url.protocol === 'ms-browser-extension:') {
      return fetch(request);
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Network first failed:', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    return cache.match(request) || new Response('Network error', { status: 503 });
  }
}

// 后台同步（如果支持）
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Background sync triggered');
  // 这里可以添加后台同步逻辑
}

// 推送通知处理
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'OldPho 有新消息',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: '关闭',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('OldPho', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 