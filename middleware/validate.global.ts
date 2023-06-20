// XXX: 这个中间件写得一团糟，需要狠狠地改一改。

import { httpResponseStatusCodes } from "helpers/http-status";

export default defineNuxtRouteMiddleware((to, from) => {
	if (environment.client)
		console.log("to", to, "\nfrom", from, "\nrouteBaseName", useNuxtApp().$getRouteBaseName());

	const routePath = getRoutePath({ route: to });
	const appSettingsStore = useAppSettingsStore();
	const settingPageId = currentSettingsPage(routePath);
	if (routePath === "settings")
		return navigateTo(useLocalePath()("/settings/" + appSettingsStore.lastSettingPage));
	if (settingPageId) {
		appSettingsStore.lastSettingPage = settingPageId;
		return;
	}
	const routeNumber = +routePath;
	if (routePath === "") // 论空字符串被转换成 0 ……
		return;
	if (routeNumber === 404)
		return;
	if (routeNumber === 601)
		return navigateTo("/601.html");
	if (routeNumber === 233)
		return abortNavigation({
			statusCode: 233,
			message: "乐",
		});
	if (Number.isFinite(routeNumber)) // 测试，如果输入的路由是数字就可以触发对应数字的错误代码。
		// 谨记千万不要使用 isFinite 而是使用 Number.isFinite，众所周知 "" == 0 ……
		return abortNavigation({
			statusCode: routeNumber,
			message: httpResponseStatusCodes[routeNumber],
		});
});

const validRoutes = ["hello", "search", "next", "settings"];

export const slugValidate = () => {
	type Validate = Parameters<typeof definePageMeta>[0]["validate"];
	const validate: Validate = route => {
		const routePath = getRoutePath({ route });
		const routeNumber = +routePath;
		if (validRoutes.includes(routePath) || currentSettingsPage(routePath))
			return true;
		if (routeNumber === 404)
			return false;
		if (Number.isFinite(routeNumber))
			return true;
		return false;
	};
	return validate;
};
