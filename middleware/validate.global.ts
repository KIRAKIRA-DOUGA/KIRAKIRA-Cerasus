import { httpResponseStatusCodes } from "helpers/http-status";

const MEDIA_INFO_MODULE_WASM = "MediaInfoModule.wasm";
const navigate = (path: string) => navigateTo(useLocalePath()(path));

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (environment.client && environment.development)
		console.log("to", to, "\nfrom", from, "\nrouteBaseName", useNuxtApp().$getRouteBaseName());

	if (environment.client)
		document.getElementById(STOP_TRANSITION_ID)?.remove();

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
	if (routeSlug[0] === "user") {
		const uid = await getUserInfo(routeSlug[1]);
		if (typeof uid === "bigint") {
			if (!routeSlug[1] || routeSlug.length >= 3 && !to.name)
				return navigate(`/user/${uid}`);
		} else
			return abortNavigation({
				statusCode: 404,
				message: uid.message,
			});
	}
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

/**
 * 如果用户已登录，则根据 cookie 中的 uid 和 token 来获取用户信息（同时具有验证用户 token 的功能）。
 * 如果未登录或验证不成功，则清空全局变量中的用户信息并清空残留 cookie。
 * @param uid - 显式指定其他用户的 UID。
 */
async function getUserInfo(uid?: string) {
	// 指定了 UID，打开该 UID 用户主页。
	if (uid) {
		let uidBigInt: bigint;
		try {
			uidBigInt = BigInt(uid);
		} catch { return new Error(`你输入的 UID: ${uid} 不合法`); }
		const userInfoResult = await api.user.getUserInfo({ uid: Number(uidBigInt) }); // TODO: UID 最好使用 string 或 bigint 存储，不要用 number 存储。
		if (userInfoResult.success) return uidBigInt;
		else return new Error(`你输入的 UID: ${uidBigInt} 用户不存在`);
	}
	// 未指定 UID，打开该自己的用户主页。
	const checkUserResult = await api.user.checkUserToken();
	if (checkUserResult.success && checkUserResult.userTokenOk)
		try {
			const selfUserInfoStore = useSelfUserInfoStore();
			await api.user.getSelfUserInfo();
			if (!selfUserInfoStore.isLogined || selfUserInfoStore.uid === undefined) throw new Error("Unlogined");
			return BigInt(selfUserInfoStore.uid);
		} catch (error) { return new Error("你的登录信息已失效，请重新登录"); }
	else return new Error("你尚未登录，请登录后再试");
}
