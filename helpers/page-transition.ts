import { userTabs } from "layouts/UserCenter.vue";

const SETTINGS = "/settings";
const USER = "/user";

/**
 * 设定页面切换动画。
 * @param pageTransition - 页面切换引用变量。
 * @returns 路由切换观察回调函数。
 */
export default function usePageTransition() {
	/** 页面切换引用变量。 */
	const pageTransition = ref("page-forward");
	
	watchRoute((route, prevRoute) => {
		[route, prevRoute] = [removeI18nPrefix(route), removeI18nPrefix(prevRoute)];
		const [slug, prevSlug] = [getLocaleRouteSlug(route), getLocaleRouteSlug(prevRoute)];
		pageTransition.value = "page-jump";
		if (prevRoute.startsWith(route)) pageTransition.value = "page-backward";
		if (route.startsWith(prevRoute)) pageTransition.value = "page-forward";
		if (route.startsWith(SETTINGS) !== prevRoute.startsWith(SETTINGS)) pageTransition.value = "";
		if (prevRoute === route) pageTransition.value = "page-backward";
		if (route.startsWith(USER) && prevRoute.startsWith(USER)) {
			const [tab, prevTab] = [slug[2] || "", prevSlug[2] || ""];
			const [index, prevIndex] = [userTabs.indexOf(tab), userTabs.indexOf(prevTab)];
			pageTransition.value = index > prevIndex ? "right" : index < prevIndex ? "left" : "";
		}
	});
	
	return pageTransition;
}
