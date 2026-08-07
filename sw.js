const CACHE = 'anfitriones-shell-v3'
const BASE = self.registration.scope
const SHELL = ['', 'manifest.webmanifest', 'app-icon.png?v=1', 'brand/anfitriones-banner-cropped.png?v=1', 'brand/anfitriones-a-cropped.png?v=1'].map(path => new URL(path, BASE).toString())
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))); self.skipWaiting() })
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))); self.clients.claim() })
self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api')) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(BASE,copy)); return response }).catch(()=>caches.match(BASE)))
    return
  }
  event.respondWith(fetch(request).then(response => { const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put(request,copy)); return response }).catch(()=>caches.match(request)))
})
