const CACHE_NAME = 'kondate-gacha-cache-v2';
const urlsToCache = ['/', '/index.html', '/style.css', '/script.js', '/icon-512x512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(names => Promise.all(names.filter(name => name.startsWith('kondate-gacha-cache-') && name !== CACHE_NAME).map(name => caches.delete(name))))) });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(res => res || fetch(e.request))) });