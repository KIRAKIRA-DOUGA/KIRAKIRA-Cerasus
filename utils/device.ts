/**
 * 判断是否是手机。
 * @returns 是否是手机。
 * @see https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html
 */
export function isMobile() {
	if (process.server) return globalThis.orientation !== undefined;
	return "ontouchstart" in document.documentElement;
}
