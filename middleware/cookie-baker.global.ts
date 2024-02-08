import { PALETTE_LIST } from "~/modules/theme/types";

export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		const appSettingsStore = useAppSettingsStore();

		const uidCookieKey = "uid";
		const tokenCookieKey = "token";

		const themeTypeCookieKey = "theme-type";
		const themeColorCookieKey = "theme-color";
		const customerThemeColorCookieKey = "customer-theme-color";
		const coloredSidebarCookieKey = "colored-side-bar";

		if (process.server) {
			const cookieUid = useCookie(uidCookieKey, { sameSite: true });
			const cookieToken = useCookie(tokenCookieKey, { sameSite: true });

			const cookieThemeType = useCookie(themeTypeCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			const cookieThemeColor = useCookie(themeColorCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			const cookieCustomerThemeColor = useCookie(customerThemeColorCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			const cookieColoredSidebar = useCookie(coloredSidebarCookieKey, { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false });
			
			if (cookieUid.value !== null && cookieUid.value !== undefined && cookieToken.value) {
				const userAuthToken: GetSelfUserInfoRequestDto | GetUserSettingsRequestDto = {
					uid: cookieUid.value ? parseInt(cookieUid.value, 10) : -1,
					token: cookieToken.value || "",
				};
				await api.user.getSelfUserInfo(userAuthToken);
				const userSettings = await api.user.getUserSettings(userAuthToken);

				cookieThemeType.value = userSettings?.userSettings?.themeType || "system";
				cookieThemeColor.value = userSettings?.userSettings?.themeColor ? (PALETTE_LIST as unknown as string[]).includes(userSettings.userSettings.themeColor) ? userSettings.userSettings.themeColor : "customer" : "pink";
				cookieCustomerThemeColor.value = userSettings?.userSettings?.themeColor || "";
				cookieColoredSidebar.value = `${userSettings?.userSettings?.coloredSideBar}`;
			} else {
				appSettingsStore.themeType = `${cookieThemeType.value}`;
				appSettingsStore.themeColor = `${cookieThemeColor.value}`;
				appSettingsStore.customerThemeColor = `${cookieCustomerThemeColor.value}`;
				appSettingsStore.coloredSideBar = cookieColoredSidebar.value === "true";

				cookieThemeType.value = cookieThemeType.value;
				cookieThemeColor.value = cookieThemeColor.value;
				cookieCustomerThemeColor.value = cookieCustomerThemeColor.value;
				cookieColoredSidebar.value = cookieColoredSidebar.value;
			}
		}
	} catch (error) {
		console.error("ERROR", "烘焙网络曲奇☆时发生了意料外的错误：", error);
		if (from.path !== "/")
			navigateTo("/");
	}
});
