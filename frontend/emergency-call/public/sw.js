// Service Worker for Emergency Call App

const CACHE_NAME = 'emergency-connect-v1';
const OFFLINE_URL = '/offline.html';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/styles/login.css',
  '/src/styles/signup.css'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    self.skipWaiting(), // Force the waiting service worker to become active
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Instead of cache.addAll, we'll use Promise.allSettled to handle failures gracefully
        const cachePromises = urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
            return null;
          })
        );
        return Promise.allSettled(cachePromises);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  self.clients.claim(); // Take control of all clients immediately
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Notify clients about updates
  if (event.data && event.data.type === 'CHECK_VERSION') {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({type: 'VERSION', version: CACHE_NAME}));
    });
  }
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.warn('Fetch failed:', error);
          return new Response('Offline content not available');
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
