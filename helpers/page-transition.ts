import { userTabs } from "layouts/user-page.vue";

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

	watchRoute((slug, prevSlug, path, prevPath) => {
		pageTransition.value = "page-jump";
		if (prevPath.startsWith(path)) pageTransition.value = "page-backward";
		if (path.startsWith(prevPath)) pageTransition.value = "page-forward";
		if (path.startsWith(SETTINGS) !== prevPath.startsWith(SETTINGS)) pageTransition.value = "";
		if (prevPath === path) pageTransition.value = "page-backward";
		if (path.startsWith(USER) && prevPath.startsWith(USER)) {
			const [tab, prevTab] = [slug[2] || "", prevSlug[2] || ""];
			const [index, prevIndex] = [userTabs.indexOf(tab), userTabs.indexOf(prevTab)];
			pageTransition.value = index > prevIndex ? "right" : index < prevIndex ? "left" : "";
		}
	});

	return pageTransition;
}
