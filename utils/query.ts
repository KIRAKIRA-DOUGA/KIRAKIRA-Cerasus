/**
 * 该部分函数剥离自 route.ts，以和通用路由函数相区别。
 */

/**
 * 检查当前是否是设置页面并获取当前设置页面的 ID 名称。
 * @param routeSlug - 路由地址数组，缺省则会自动获取。
 * @returns 如当前不是设置页面则返回空字符串，反之则获取当前设置页面的 ID 名称。
 */
export function currentSettingsPage(routeSlug?: string[]) {
	routeSlug = routeSlug && routeSlug.length ? routeSlug : getLocaleRouteSlug();
	return routeSlug[0] === "settings" ? routeSlug[1] ?? "" : "";
}

/**
 * 获取当前用户 UID。
 * @returns - 当前用户 UID。
 */
export function currentUserUid() {
	const routeSlug = getLocaleRouteSlug();
	return routeSlug[0] === "user" ? +routeSlug[1] ?? 0 : -1;
}

/**
 * 获取当前用户页选中标签页。
 * @returns - 当前用户页标签。
 */
export function currentUserTab() {
	const routeSlug = getLocaleRouteSlug();
	return routeSlug[0] === "user" ? routeSlug[2] ?? "" : "";
}

/**
 * 获取当前视频 KVID。
 * @returns - 当前视频 KVID。
 */
export function currentVideoKvid() {
	const routeSlug = getLocaleRouteSlug();
	return routeSlug[0] === "videos" || routeSlug[0] === "video" ? +routeSlug[1] ?? 0 : -1;
}
