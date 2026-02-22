const CACHE = "marice-v2";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json",
        "./img/mar-ice.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});