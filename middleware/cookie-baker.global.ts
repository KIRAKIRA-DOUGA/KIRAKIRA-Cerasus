export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		const appSettingsStore = useAppSettingsStore();

		const uidCookieKey = "uid";
		const tokenCookieKey = "token";
		const showCssDoodleCookieKey = "show-css-doodle";
		const sharpAppearanceModeCookieKey = "sharp-appearance-mode";
		const flatAppearanceModeCookieKey = "flat-appearance-mode";
		const coloredSideBarCookieKey = "colored-side-bar";

		if (process.server) {
			// TODO 服务端渲染，通过 cookie 中的用户信息获取用户设置并影响服务端渲染结果，如果没有设置则直接使用 cookie 中的设置

			const cookieUid = useCookie(uidCookieKey, { sameSite: true });
			const cookieToken = useCookie(tokenCookieKey, { sameSite: true });
			const cookieShowCssDoodle = useCookie(showCssDoodleCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			const cookieSharpAppearanceMode = useCookie(sharpAppearanceModeCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			const cookieFlatAppearanceMode = useCookie(flatAppearanceModeCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			const cookieColoredSideBar = useCookie(coloredSideBarCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			
			if (cookieUid !== null && cookieUid !== undefined && cookieToken) {
				const userAuthToken: GetSelfUserInfoRequestDto | GetUserSettingsRequestDto = {
					uid: cookieUid.value ? parseInt(cookieUid.value, 10) : -1,
					token: cookieToken.value || "",
				};
				const seltUserInfo = await api.user.getSelfUserInfo(userAuthToken);
				const userSettings = await api.user.getUserSettings(userAuthToken);

				cookieShowCssDoodle.value = `${userSettings?.userSettings?.showCssDoodle}`;
				cookieSharpAppearanceMode.value = `${userSettings?.userSettings?.sharpAppearanceMode}`;
				cookieFlatAppearanceMode.value = `${userSettings?.userSettings?.flatAppearanceMode}`;
				cookieColoredSideBar.value = `${userSettings?.userSettings?.coloredSideBar}`;
			} else {
				// TODO
				appSettingsStore.showCssDoodle = typeof cookieShowCssDoodle.value === "boolean" ? cookieShowCssDoodle.value : cookieShowCssDoodle.value === "true";
				appSettingsStore.sharpAppearanceMode = typeof cookieSharpAppearanceMode.value === "boolean" ? cookieSharpAppearanceMode.value : cookieSharpAppearanceMode.value === "true";
				appSettingsStore.flatAppearanceMode = typeof cookieFlatAppearanceMode.value === "boolean" ? cookieFlatAppearanceMode.value : cookieFlatAppearanceMode.value === "true";
				appSettingsStore.coloredSideBar = typeof cookieColoredSideBar.value === "boolean" ? cookieColoredSideBar.value : cookieColoredSideBar.value === "true";
			}
		} else {
			// TODO 客户端渲染
			
			const cookieShowCssDoodle = useCookie(showCssDoodleCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			const cookieSharpAppearanceMode = useCookie(sharpAppearanceModeCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			const cookieFlatAppearanceMode = useCookie(flatAppearanceModeCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			const cookieColoredSideBar = useCookie(coloredSideBarCookieKey, { expires: new Date("9999/9/9"), sameSite: true });
			
			appSettingsStore.showCssDoodle = typeof cookieShowCssDoodle.value === "boolean" ? cookieShowCssDoodle.value : cookieShowCssDoodle.value === "true";
			appSettingsStore.sharpAppearanceMode = typeof cookieSharpAppearanceMode.value === "boolean" ? cookieSharpAppearanceMode.value : cookieSharpAppearanceMode.value === "true";
			appSettingsStore.flatAppearanceMode = typeof cookieFlatAppearanceMode.value === "boolean" ? cookieFlatAppearanceMode.value : cookieFlatAppearanceMode.value === "true";
			appSettingsStore.coloredSideBar = typeof cookieColoredSideBar.value === "boolean" ? cookieColoredSideBar.value : cookieColoredSideBar.value === "true";
		}
	} catch (error) {
		console.error("ERROR", "烘焙网络曲奇☆时发生了意料外的错误：", error);
		if (from.path !== "/")
			navigateTo("/");
	}
});
