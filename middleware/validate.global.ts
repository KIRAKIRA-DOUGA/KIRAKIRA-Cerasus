import { httpResponseStatusCodes } from "helpers/http-status";

const MEDIA_INFO_MODULE_WASM = "MediaInfoModule.wasm";
const navigate = (path: string) => navigateTo(useLocalePath()(path));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineNuxtRouteMiddleware((to, from) => {
	if (environment.client && environment.development)
		console.log("to", to, "\nfrom", from, "\nrouteBaseName", useNuxtApp().$getRouteBaseName());

	const routePath = getRoutePath({ route: to });
	const routeSlug = getLocaleRouteSlug(to), prevRouteSlug = getLocaleRouteSlug(from);
	const appSettingsStore = useAppSettingsStore();
	const settingPageId = currentSettingsPage(routeSlug);
	if (routeSlug[0] === "settings" && prevRouteSlug[0] !== "settings")
		appSettingsStore.exitSettingRoute = "/" + getRoutePath({ route: from });
	if (routePath === "settings")
		return navigate("/settings/" + appSettingsStore.lastSettingPage);
	if (settingPageId) {
		if (settingPageId === "exit")
			return navigate(appSettingsStore.getExitSettingRoute);
		appSettingsStore.lastSettingPage = settingPageId;
		return;
	}
	if (routeSlug[0] === "user" && routeSlug.length >= 3 && !to.name)
		return navigate(`/user/${routeSlug[1]}`);
	if (routeSlug.at(-1) === MEDIA_INFO_MODULE_WASM)
		return navigateTo(`/${MEDIA_INFO_MODULE_WASM}`);
	if (routeSlug[0] === "error") {
		const routeNumber = +routeSlug[1];
		if (routeSlug[1] === "") // 论空字符串被转换成 0 ……
			return;
		if (routeNumber === 404)
			return;
		if (routeNumber === 601)
			return navigateTo("/unsupported");
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
	}
});
