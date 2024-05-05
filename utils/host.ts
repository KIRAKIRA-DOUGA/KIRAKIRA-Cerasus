// 直接放在 router.ts 里面，会引发 computed 未定义的离谱错误。

/**
 * 获取当前网址的 host，即域名主机部分。
 * @returns - 当前网址的 host。
 */
export function getHost() {
	const nuxtApp = useNuxtApp();
	const host: string = process.server ? nuxtApp.ssrContext!.event.node.req.headers.host! : window.location.host;
	return host;
}
