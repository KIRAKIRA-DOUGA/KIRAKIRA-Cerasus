import type { NavigateToOptions } from "nuxt/dist/app/composables/router";
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded, RouteLocationRaw } from "vue-router";

const localeCodes = computed(() => useNuxtApp().$i18n.localeCodes.value);
type Route = RouteLocationNormalized | RouteLocationNormalizedLoaded;

/**
 * 获取系统当前的路由。
 * @returns 系统路由。
 */
export function getRoutePath({
	route = useRouter().currentRoute.value,
	removeI18nPrefix: removeI18n = true, // removeI18nPrefix 和下面的函数重名因而会导致异常。
	fullPath = false,
}: Partial<{
	/** 路由对象。留空时将会自动获取。 */
	route: Route | string;
	/** 是否移除语言名称前缀？默认为是。 */
	removeI18nPrefix: boolean;
	/** 是否使用完整的路径？即包括 Hash 和 Search Params 在内。 */
	fullPath: boolean;
}> = {}): string {
	let path = typeof route === "string" ? route : fullPath ? route.fullPath : route.path;
	path = path.replace(/^\//, ""); // 移除根节点斜杠。
	if (removeI18n)
		path = path.replace(new RegExp(`^(${localeCodes.value.join("|")})(\\/|$)`), ""); // 移除语言前缀。
	return path;
}

/**
 * 获取去除语言名称前缀的路由数组。
 * @param route - 路由对象。留空时将会自动获取。
 * @returns 路由数组。
 */
export function getLocaleRouteSlug(route?: Route | string) {
	if (typeof route !== "string") route = getRoutePath({ route });
	return route.split("/").filter(Boolean);
}

/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新路径数组、旧路径数组、新路径字符串、旧路径字符串。
 * @param immediate - 首次启动不会被调用。
 */
export function watchRoute(callback: (slug: string[], prevSlug: string[], path: string, prevPath: string) => void, immediate?: false): void;
/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新路径数组、旧路径数组（首次启动时为 undefined）、新路径字符串、旧路径字符串（首次启动时为 undefined）。
 * @param immediate - 立即调用一次。
 */
export function watchRoute(callback: (slug: string[], prevSlug: string[] | undefined, path: string, prevPath: string | undefined) => void, immediate: true): void;
/**
 * 传入路由发生变化后的回调函数。
 * @param callback - 回调函数，其参数依次为新路径数组、旧路径数组、新路径字符串、旧路径字符串。
 * @param immediate - 是否立即调用一次。
 */
export function watchRoute(callback: (slug: string[], prevSlug: string[], path: string, prevPath: string) => void, immediate = false): void {
	const router = useRouter();
	watch(
		() => router.currentRoute.value.path,
		(path, prevPath) => {
			[path, prevPath] = [removeI18nPrefix(path), removeI18nPrefix(prevPath)];
			const [slug, prevSlug] = [getLocaleRouteSlug(path), getLocaleRouteSlug(prevPath)];
			callback(slug, prevSlug, path, prevPath);
		},
		{ immediate: immediate as false },
	);
}

/**
 * 导航到页面。
 * @param to - 路由地址或路由参数对象。
 * @param options - 其它选项。
 * @returns 表示导航成功的承诺。
 */
export function navigate(to: RouteLocationRaw, options?: NavigateToOptions) {
	return navigateTo(useLocalePath()(to), options);
}

/**
 * 切换语言。
 * @param lang - 语言代码。
 */
export function switchLanguage(lang: string) {
	if (getCurrentLocale() === lang) return;
	const switchLocalePath = useSwitchLocalePath();
	switchLocalePath(lang as never);
	// useRouter().push(switchLocalePath(value)); // 旧方法，不推荐使用。
	if (lang === "zhs") lang = "/";
	else lang = `/${lang}/`;
	const update = () => { useRouter().push(lang + getRoutePath()); };
	if (environment.server) update();
	else { // 切换语言动画。
		const settings = document.querySelector(".settings");
		const element = settings ?? document.body;
		const routerView = settings?.closest(".router-view") ?? element.querySelector(".router-view");
		routerView?.classList.add("stop-transition");
		const TRANSITION_DURATION = 500;
		const HALFTONE_SIZE = 4 * Math.SQRT1_2; // 在此处调整半调圆圈的大小。
		if (!document.startViewTransition) {
			update();
			document.body.animate([
				{ filter: "blur(10px)" },
				{ filter: "blur(0)" },
			], { duration: TRANSITION_DURATION, easing: eases.easeOutSmooth });
		} else
			startColorViewTransition(update, [
				[{
					clipPath: ["inset(0 0 calc(100% + 1rlh))", "inset(0)"],
				}],
				[{
					clipPath: ["inset(0 0 0)", "inset(calc(100% + 1rlh) 0 0)"],
				}, {
					pseudoElement: "::view-transition-old(root)",
				}],
				[{
					filter: ["", "grayscale(1)"],
				}, {
					pseudoElement: "::view-transition-old(root)",
					easing: eases.easeOutSmooth,
				}],
				[{
					filter: ["grayscale(1) blur(var(--view-transition-blurriness))", "grayscale(0) blur(var(--view-transition-blurriness))"],
				}, {
					pseudoElement: "::view-transition-new(root)",
					easing: eases.easeInSmooth,
				}],
				[{
					scale: ["", "1.05"],
					transformOrigin: ["bottom", "bottom"],
				}, {
					pseudoElement: "::view-transition-old(root)",
					easing: eases.easeInMax,
				}],
				[{
					"--view-transition-blurriness": ["5px", ""],
					scale: ["1.05", ""],
					transformOrigin: ["top", "top"],
				}, {
					pseudoElement: "::view-transition-new(root)",
					easing: eases.easeOutMax,
				}],
				[{
					"--view-transition-halftone-gradient": ["0", `${HALFTONE_SIZE}px`],
				}, {
					pseudoElement: "::view-transition-new(root)",
					easing: "cubic-bezier(0, 0, 0.7, 1)",
				}],
				[{
					"--view-transition-halftone-gradient": [`${HALFTONE_SIZE}px`, "0"],
				}, {
					pseudoElement: "::view-transition-old(root)",
					easing: "cubic-bezier(0.3, 0, 1, 1)",
				}],
			], {
				duration: TRANSITION_DURATION,
				cursor: "wait",
				staticStyle: `
					:root::view-transition-old(root),
					:root::view-transition-new(root) {
						mask-image:
							radial-gradient(white var(--view-transition-halftone-gradient), transparent var(--view-transition-halftone-gradient)),
							radial-gradient(white var(--view-transition-halftone-gradient), transparent var(--view-transition-halftone-gradient));
						mask-position: 0 0, ${HALFTONE_SIZE}px ${HALFTONE_SIZE}px;
						mask-size: ${HALFTONE_SIZE * 2}px ${HALFTONE_SIZE * 2}px;
					}
				`,
			});
		setTimeout(() => {
			routerView?.classList.remove("stop-transition");
		}, TRANSITION_DURATION);
	}
}

/**
 * 移除路由的语言前缀。
 * @param route - 路由地址。
 * @returns - 移除了语言前缀的路由。
 */
export function removeI18nPrefix(route?: string) {
	if (route === undefined) return undefined!;
	let result = route.replace(new RegExp(`^\\/?(${localeCodes.value.join("|")})\\/?`), "");
	if (result === "") result = "/";
	return result;
}

/**
 * 判断是否是当前路由路径，去除语言前缀和哈希、查询参数后缀。
 * @param path - 要判断的路由路径。
 * @returns 是否是当前路由路径？
 */
export function isCurrentPath(path: string) {
	return getRoutePath({ route: path }) === getRoutePath();
}
