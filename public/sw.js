self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // A minimal fetch event handler is required for PWA installability
  return;
});
