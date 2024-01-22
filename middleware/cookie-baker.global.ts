export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		if (process.server) {
			// TODO 服务端渲染，通过 cookie 中的用户信息获取用户设置并影响服务端渲染结果，如果没有设置则直接使用 cookie 中的设置

			// ↓ 下方的测试是从获取客户端 cookie，然后通过 cookie 异步请求用户信息/设置，并将用户信息存放至 pinia 并在服务端渲染时直接使用 pinia 中的值
			const uid = useCookie("uid");
			const token = useCookie("token");
			const userAuthToken: GetSelfUserInfoRequestDto | GetUserSettingsRequestDto = {
				uid: uid.value ? parseInt(uid.value, 10) : -1,
				token: token.value || "",
			};
			const userInfo = await api.user.getSelfUserInfo(userAuthToken);
			const userSettings = await api.user.getUserSettings(userAuthToken);

			// ↓ 下方的测试是从 Nuxt 服务端主动设置 cookie 到客户端
			const testSettingCookie = useCookie("test");
			testSettingCookie.value = `${testSettingCookie.value !== null && testSettingCookie.value !== undefined ? parseInt(testSettingCookie.value, 10) + 1 : 100}`;
		} else {
			// TODO 客户端渲染
		}
	} catch (error) {
		if (from.path !== "/") {
			console.error("ERROR", "烘焙网络曲奇☆时发生了意料外的错误：", error);
			navigateTo("/");
		}
	}
});
