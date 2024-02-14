import { CUSTOM_THEME_COLOR, DEFAULT_THEME_COLOR, SYSTEM_THEME, coloredSidebarCookieKey, customThemeColorCookieKey, isOfflineSettingsCookieKey, themeColorCookieKey, themeTypeCookieKey } from "~/modules/theme/cookieBinding";
import { PALETTE_LIST } from "~/modules/theme/types";

export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		// Cookie 键 - 用户认证
		const uidCookieKey = "uid";
		const tokenCookieKey = "token";

		if (process.server) { // 仅限服务端
			// Nuxt cookie 对象 - 用户认证
			const cookieUid = useCookie(uidCookieKey, { sameSite: true });
			const cookieToken = useCookie(tokenCookieKey, { sameSite: true });

			const userSettingsCookieBasicOption = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false };
			// Nuxt cookie 对象 - 用户样式设置
			const cookieThemeType = useCookie(themeTypeCookieKey, userSettingsCookieBasicOption);
			const cookieThemeColor = useCookie(themeColorCookieKey, userSettingsCookieBasicOption);
			const cookieCustomerThemeColor = useCookie(customThemeColorCookieKey, userSettingsCookieBasicOption);
			const cookieColoredSidebar = useCookie(coloredSidebarCookieKey, userSettingsCookieBasicOption);

			// nuxt cookie 对象 - 是否使用离线样式设置
			const cookieIsLocalStorage = useCookie(isOfflineSettingsCookieKey, userSettingsCookieBasicOption);
			
			const uid = cookieUid.value;
			const token = cookieToken.value;
			
			if (uid !== null && uid !== undefined && token) {
				// 如果用户认证 cookie 存在，则通过认证 cookie 获取数据库中存储的用户样式设置，并将获取到的设置信息存储至 cookie
				const userAuthToken: GetSelfUserInfoRequestDto | GetUserSettingsRequestDto = {
					uid: uid ? parseInt(uid, 10) : -1,
					token: token || "",
				};
				await api.user.getSelfUserInfo(userAuthToken);
				const userSettings = await api.user.getUserSettings(userAuthToken);

				cookieThemeType.value = userSettings?.userSettings?.themeType || SYSTEM_THEME;
				cookieThemeColor.value = userSettings?.userSettings?.themeColor ? (PALETTE_LIST as unknown as string[]).includes(userSettings.userSettings.themeColor) ? userSettings.userSettings.themeColor : CUSTOM_THEME_COLOR : DEFAULT_THEME_COLOR;
				cookieCustomerThemeColor.value = userSettings?.userSettings?.themeColor || "";
				cookieColoredSidebar.value = `${userSettings?.userSettings?.coloredSideBar}`;

				cookieIsLocalStorage.value = "false";
			} else
				cookieIsLocalStorage.value = "true";
		}
	} catch (error) {
		console.error("ERROR", "烘焙网络曲奇☆时发生了意料外的错误：", error);
		if (from.path !== "/")
			navigateTo("/");
	}
});
