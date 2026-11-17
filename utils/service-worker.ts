/**
 * 注销旧版站点的 Service Worker，并清理其缓存。
 * @returns 清理任务完成时兑现的 Promise。
 */
export async function retireLegacyServiceWorker(): Promise<void> {
	if (!("serviceWorker" in navigator)) return;
	try {
		const legacyScriptURL = new URL("/sw.js", location.origin).href;
		const registrations = await navigator.serviceWorker.getRegistrations();
		await Promise.all(registrations
			.filter(registration => [registration.active, registration.waiting, registration.installing]
				.some(worker => worker?.scriptURL === legacyScriptURL))
			.map(registration => registration.unregister()));
		if ("caches" in globalThis)
			await Promise.all(["navigation", "assets", "images"].map(name => caches.delete(name)));
	} catch (error) {
		console.warn("[Service Worker] Legacy cleanup failed:", error);
	}
}
