// 휴대폰 홈 화면 설치(PWA)용 서비스 워커. 웹 주소(https)로 올렸을 때만 등록된다(file://·게시 페이지에서는 쓰지 않는다).
// 하는 일: 화면 파일을 캐시해 두고, 열 때는 먼저 서버에서 새 것을 받고(네트워크 우선) 안 되면 마지막 캐시를 보인다.
const CACHE = 'df-radar-v2';
const PAGES = ['./df-radar.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PAGES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
