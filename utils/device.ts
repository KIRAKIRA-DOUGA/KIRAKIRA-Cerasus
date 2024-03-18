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
 * 判断指针事件是否由鼠标触发而非触摸触发。
 * @param e - 指针点击事件。
 * @returns 指针事件由鼠标触发而非触摸触发？
 */
export function isMouse(e?: PointerEvent) {
	return e?.pointerType !== "touch";
}
