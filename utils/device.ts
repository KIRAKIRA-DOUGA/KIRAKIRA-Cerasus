/**
 * 判断是否是手机。
 * @returns 是否是手机。
 * @see https://www.ruanyifeng.com/blog/2021/09/detecting-mobile-browser.html
 */
export function isMobile() {
	if (environment.server) return globalThis.orientation !== undefined;
	return "ontouchstart" in document.documentElement;
}

/**
 * 使用页面宽度判断设备类型。
 * @returns 设备类型。
 */
export function getResponsiveDevice() {
	if (environment.server) return "computer";
	else if (window.innerWidth <= 639) return "mobile";
	else if (window.innerWidth <= 991) return "tablet";
	else return "computer";
}

/**
 * 判断指针事件是否由鼠标触发而非触摸触发。
 * @param e - 指针点击事件。
 * @returns 指针事件由鼠标触发而非触摸触发？
 */
export function isMouse(e?: PointerEvent) {
	return e?.pointerType !== "touch";
}

/**
 * 获取当前操作系统。
 * @returns 当前操作系统。
 */
export function getPlatform() {
	if (environment.server) return;
	const { platform } = navigator;
	if (/(Mac|iPhone|iPod|iPad)/i.test(platform)) return "Apple";
	else if (/(Linux)/i.test(platform)) return "Linux";
	else if (/(Win)/i.test(platform)) return "Windows";
}
