const CACHE = "marice-v3";

const archivos = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./img/icono-192.png",
  "./img/icono-512.png",

];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(archivos))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
      .catch(() => caches.match("./index.html"))
  );
});

self.addEventListener("push", e => {
  self.registration.showNotification("MAR-ICE", {
    body: "Tu pedido está listo 🍧",
    icon: "img/icono-192.png"
  });
});