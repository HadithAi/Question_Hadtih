const CACHE_NAME = "hadith-keywords-cache-v3"; // حتماً نسخه کش را تغییر دهید
const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./styles.css",
    "./script.js",
    "./icons/icon-192x192.png",
    "./icons/icon-512x512.png"
];

// نصب Service Worker و کش کردن فایل‌ها
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// فعال‌سازی Service Worker و حذف کش‌های قدیمی
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// مدیریت درخواست‌ها با استراتژی Stale-While-Revalidate
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                // بازگرداندن نسخه کش‌شده بلافاصله
                event.waitUntil(
                    fetch(event.request).then((newResponse) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, newResponse.clone());
                            return newResponse;
                        });
                    })
                );
                return response;
            }
            return fetch(event.request);
        })
    );
});
