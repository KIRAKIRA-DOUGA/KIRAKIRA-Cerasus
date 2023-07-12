import { RouteLocationNormalized, RouteLocationNormalizedLoaded } from "vue-router";

const localeCodes = computed(() => useNuxtApp().$i18n.localeCodes.value);
type Route = RouteLocationNormalized | RouteLocationNormalizedLoaded;

/**
 * 获取系统当前的路由。
 * @returns 系统路由。
 */
export function getRoutePath({
	route = useRouter().currentRoute.value,
	removeI18nPrefix: removeI18n = true, // removeI18nPrefix 和下面的函数重名因而会导致异常。
}: Partial<{
	/** 路由对象。留空时将会自动获取。 */
	route: Route;
	/** 是否移除语言名称前缀。默认为是。 */
	removeI18nPrefix: boolean;
}> = {}): string {
	let path = route.path;
	path = path.slice(1); // 移除根节点斜杠。
	if (removeI18n)
		path = path.replace(new RegExp(`^(${localeCodes.value.join("|")})\\/?`), ""); // 移除语言前缀。
	return path;
}

/**
 * 获取去除语言名称前缀的路由数组。
 * @param route - 路由对象。留空时将会自动获取。
 * @returns 路由数组。
 */
export function getLocaleRouteSlug(route?: Route | string) {
	if (typeof route !== "string") route = getRoutePath({ route });
	return route.split("/").filter(i => i);
}

/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新值、旧值。
 * @param immediate - 首次启动不会被调用。
 */
export function watchRoute(callback: (newValue: string, oldValue: string) => void, immediate?: false): void;
/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新值、旧值（首次启动时为 undefined）。
 * @param immediate - 立即调用一次。
 */
export function watchRoute(callback: (newValue: string, oldValue: string | undefined) => void, immediate: true): void;
/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新值、旧值。
 * @param immediate - 是否立即调用一次。
 */
export function watchRoute(callback: (newValue: string, oldValue: string) => void, immediate = false): void {
	const router = useRouter();
	watch(
		() => router.currentRoute.value.path,
		callback,
		{ immediate: immediate as false },
	);
}

/**
 * 导航到页面。
 * @param path - 路由地址。
 */
export function navigate(path: string) {
	useRouter().push(useLocalePath()(path));
}

/**
 * 切换语言。
 * @param lang - 语言代码。
 */
export function switchLanguage(lang: string) {
	if (getCurrentLocale() === lang) return;
	const switchLocalePath = useSwitchLocalePath();
	switchLocalePath(lang);
	// useRouter().push(switchLocalePath(value)); // 旧方法，不推荐使用。
	if (lang === "zh") lang = "/";
	else lang = `/${lang}/`;
	useRouter().push(lang + getRoutePath());
	if (environment.client) { // 切换语言动画。
		const element = document.querySelector(".settings") ?? document.body;
		element.animate([
			{ filter: "blur(10px)" },
			{ filter: "blur(0)" },
		], { duration: 500, easing: eases.easeOutSmooth });
	}
}

/**
 * 移除路由的语言前缀。
 * @param route - 路由地址。
 * @returns - 移除了语言前缀的路由。
 */
export function removeI18nPrefix(route: string) {
	let result = route.replace(/^\/(zh|en|ja)(?=\/|$)/, "");
	if (result === "") result = "/";
	return result;
}

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

export function videos(route?: string) {
	route ||= getRoutePath();
	return route.match(/(?<=videos\/)[0-9-]+/)?.[0] ?? "";
}
