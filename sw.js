const CACHE_NAME = "asesor-uriel-v1";
const ARCHIVOS = [
    "./",
    "index.html",
    "styles.css",
    "script.js",
    "manifest.json",
    "icon-192.png",
    "icon-512.png",
    "splash.png"
];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ARCHIVOS)));
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
