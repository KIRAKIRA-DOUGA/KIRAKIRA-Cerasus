import { WatchCallback } from "nuxt/dist/app/compat/capi";
import { RouteLocationNormalized, RouteLocationNormalizedLoaded } from "vue-router";

/**
 * 获取系统当前的路由。
 * @returns 系统路由。
 */
export function getRoutePath({
	route = useRouter().currentRoute.value,
	removeI18nPrefix = true,
}: Partial<{
	/** 路由对象。留空时将会自动获取。 */
	route: RouteLocationNormalized | RouteLocationNormalizedLoaded;
	/** 是否移除语言名称前缀。默认为是。 */
	removeI18nPrefix: boolean;
}> = {}): string {
	let path = route.path;
	path = path.slice(1); // 移除根节点斜杠。
	if (removeI18nPrefix)
		path = path.replace(new RegExp(`^${getCurrentLocale()}\\/?`), ""); // 移除语言前缀。
	return path;
}

/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新值、旧值。
 * @param immediate - 是否立即调用一次。
 */
export function watchRoute(callback: (newValue: string, oldValue: string) => void, immediate = false): void {
	const router = useRouter();
	watch(
		() => router.currentRoute.value.path,
		callback as unknown as WatchCallback<object, object | undefined>,
		{ immediate },
	);
}

/**
 * 导航到页面。
 * @param path - 路由地址。
 */
export function navigate(path: string) {
	useRouter().push(useLocalePath()(path));
}
