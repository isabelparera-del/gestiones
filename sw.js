// Service Worker para notificaciones push - Mis Gestiones
const CACHE = 'gestiones-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Fetch: network first, fallback to cache for offline
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      })
      .catch(() => caches.match(e.request))
  );
});

// Notification click: open/focus the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(list => {
      const appUrl = '/gestiones/';
      for(const c of list){
        if(c.url.includes('/gestiones') && 'focus' in c) return c.focus();
      }
      if(clients.openWindow) return clients.openWindow(appUrl);
    })
  );
});
