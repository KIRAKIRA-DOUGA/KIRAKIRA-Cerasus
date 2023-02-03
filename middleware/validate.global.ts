import { httpResponseStatusCodes } from "helpers/http-status";

export default defineNuxtRouteMiddleware((to, from) => {
	console.log("to", to, "\nfrom", from, "\nrouteBaseName", useNuxtApp().$getRouteBaseName());

	const routePath = getRoutePath({ route: to });
	const routeNumber = +routePath;
	if (routePath === "abort")
		return abortNavigation();
	if (routeNumber === 404)
		return;
	if (routeNumber === 601)
		return navigateTo("/601.html");
	if (routeNumber === 233)
		return abortNavigation({
			statusCode: 233,
			message: "乐",
		});
	if (isFinite(routeNumber)) // 测试，如果输入的路由是数字就可以触发对应数字的错误代码。
		return abortNavigation({
			statusCode: routeNumber,
			message: httpResponseStatusCodes[routeNumber],
		});
});
