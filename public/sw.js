// Service worker: permite jugar sin internet.
// ⚠️ Cada vez que publiques cambios, subí el número de VERSION para que los dispositivos actualicen.
const VERSION = "v3";
const CACHE = "alt-" + VERSION;
const SHELL = [
  "./", "index.html", "apoyar.html", "404.html",
  "css/base.css", "css/prepa.css", "js/home.js", "js/catalog.js", "js/config.js", "js/voz.js", "js/prepa.js",
  "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png",
  "juegos/reloj.html", "juegos/restas-bloques.html", "juegos/pulperia.html",
  "juegos/sumas-bloques.html", "juegos/animales-cr.html", "juegos/provincias.html", "juegos/listen-tap.html",
  "juegos/contar.html", "juegos/colores-figuras.html", "juegos/sonido-inicial.html", "juegos/trazos.html",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la red (para ver cambios), si no hay internet usa la copia guardada.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res && (res.ok || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
