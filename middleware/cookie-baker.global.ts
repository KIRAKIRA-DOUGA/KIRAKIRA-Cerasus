import { COOKIE_NOT_FOUND, CUSTOMER_THEME_COLOR, DEFAULT_THEME_COLOR, SYSTEM_THEME, coloredSidebarCookieKey, customerThemeColorCookieKey, themeColorCookieKey, themeTypeCookieKey } from "~/modules/theme/cookieBinding";
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

			// Nuxt cookie 对象 - 用户样式设置
			const cookieThemeType = useCookie(themeTypeCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			const cookieThemeColor = useCookie(themeColorCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			const cookieCustomerThemeColor = useCookie(customerThemeColorCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			const cookieColoredSidebar = useCookie(coloredSidebarCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			
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
				cookieThemeColor.value = userSettings?.userSettings?.themeColor ? (PALETTE_LIST as unknown as string[]).includes(userSettings.userSettings.themeColor) ? userSettings.userSettings.themeColor : CUSTOMER_THEME_COLOR : DEFAULT_THEME_COLOR;
				cookieCustomerThemeColor.value = userSettings?.userSettings?.themeColor || "";
				cookieColoredSidebar.value = `${userSettings?.userSettings?.coloredSideBar}`;
			} else {
				// 如果用户认证 cookie 不存在，则尝试续期（重新赋值）离线用户样式设置 cookie，如果连离线用户样式设置 cookie 都不存在了，则存储一个特殊标识字符串：“404”，在后续的客户端渲染处理步骤中，对于 “404” 的 cookie，会尝试从 localStorage 里获取
				cookieThemeType.value = cookieThemeType.value === undefined ? COOKIE_NOT_FOUND : cookieThemeType.value;
				cookieThemeColor.value = cookieThemeColor.value === undefined ? COOKIE_NOT_FOUND : cookieThemeColor.value;
				cookieCustomerThemeColor.value = cookieCustomerThemeColor.value === undefined ? COOKIE_NOT_FOUND : cookieCustomerThemeColor.value;
				cookieColoredSidebar.value = cookieColoredSidebar.value === undefined ? COOKIE_NOT_FOUND : cookieColoredSidebar.value;
			}
		}
	} catch (error) {
		console.error("ERROR", "烘焙网络曲奇☆时发生了意料外的错误：", error);
		if (from.path !== "/")
			navigateTo("/");
	}
});
