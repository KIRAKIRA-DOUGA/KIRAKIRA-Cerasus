// 保留原 URL，让仍受旧 Service Worker 控制的页面也能更新到清理脚本。
// 不处理 fetch，所有请求直接使用浏览器正常的网络和 HTTP 缓存。
self.addEventListener("install", event => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
	event.waitUntil(
		Promise.all(["navigation", "assets", "images"].map(name => caches.delete(name)))
			.finally(() => self.registration.unregister()),
	);
});
