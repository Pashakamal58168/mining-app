self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open("minex-cache").then((cache) => {
        return cache.addAll([
          "./",
          "./index.html",
          "./style.css",
          "./app.js",
          "./firebase-config.js",
          "./icon-192.png",
          "./icon-512.png"
        ]);
      })
    );
  });
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  