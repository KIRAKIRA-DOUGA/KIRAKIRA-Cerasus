import type { CookieRef } from "nuxt/app";
import { CUSTOM_THEME_COLOR, DEFAULT_THEME_COLOR, SYSTEM_THEME, coloredSidebarCookieKey, cookieBinding, customThemeColorCookieKey, flatAppearanceModeCookieKey, isOfflineSettingsCookieKey, sharpAppearanceModeCookieKey, themeColorCookieKey, themeTypeCookieKey } from "./cookieBinding";
import { PALETTE_LIST } from "./types";

/**
 * 服务端渲染时，获取请求时传递的用户 token cookie
 * 如果用户 token 通过验证，则请求最新用户设置并用最新值更新到 cookie 中（这回导致本次 SSR 渲染响应到达客户端时，客户端 cookie 也随之更新），然后续期 cookie
 * 如果用户 token 未通过验证，则续期 cookie
 */
export async function cookieBaker() {
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
		const cookieSharpAppearanceMode = useCookie(sharpAppearanceModeCookieKey, userSettingsCookieBasicOption);
		const cookieFlatAppearanceMode = useCookie(flatAppearanceModeCookieKey, userSettingsCookieBasicOption);
		// HACK 5 在此处添加

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
			cookieCustomerThemeColor.value = userSettings?.userSettings?.themeColor || DEFAULT_THEME_COLOR;
			cookieColoredSidebar.value = `${userSettings?.userSettings?.coloredSideBar === true}`;
			cookieSharpAppearanceMode.value = `${userSettings?.userSettings?.sharpAppearanceMode === true}`;
			cookieFlatAppearanceMode.value = `${userSettings?.userSettings?.flatAppearanceMode === true}`;
			// HACK 6 在此处添加

			cookieIsLocalStorage.value = "false";
		} else
			cookieIsLocalStorage.value = "true";
	}
}

/**
 * 将用户设置追加到浏览器 cookie 中
 * @param userSettings 用户设置
 */
export function saveUserSetting2BrowserCookie(userSettings: GetUserSettingsResponseDto) {
	if (process.client) {
		const currentThemeType = userSettings?.userSettings?.themeType || SYSTEM_THEME;
		const themeColor = userSettings?.userSettings?.themeColor ? (PALETTE_LIST as unknown as string[]).includes(userSettings.userSettings.themeColor) ? userSettings.userSettings.themeColor : CUSTOM_THEME_COLOR : DEFAULT_THEME_COLOR;
		const customerThemeColor = userSettings?.userSettings?.themeColor || "";
		const isColoredSidebar = userSettings?.userSettings?.coloredSideBar || false;
		const isSharpAppearanceMode = userSettings?.userSettings?.sharpAppearanceMode || false;
		const isFlatAppearanceMode = userSettings?.userSettings?.flatAppearanceMode || false;
		// HACK 7 在此处添加

		const userSettingsCookieBasicOption = `; expires=${new Date("9999/9/9").toUTCString()}; path=/; SameSite=Strict`;
		document.cookie = `${isOfflineSettingsCookieKey}=false${userSettingsCookieBasicOption}`;
		if (currentThemeType) document.cookie = `${themeTypeCookieKey}=${currentThemeType}${userSettingsCookieBasicOption}`;
		if (themeColor) document.cookie = `${themeColorCookieKey}=${themeColor}${userSettingsCookieBasicOption}`;
		if (customerThemeColor) document.cookie = `${customThemeColorCookieKey}=${customerThemeColor}${userSettingsCookieBasicOption}`;
		if (isColoredSidebar !== undefined && isColoredSidebar !== null) document.cookie = `${coloredSidebarCookieKey}=${isColoredSidebar}${userSettingsCookieBasicOption}`;
		if (isSharpAppearanceMode !== undefined && isSharpAppearanceMode !== null) document.cookie = `${sharpAppearanceModeCookieKey}=${isSharpAppearanceMode}${userSettingsCookieBasicOption}`;
		if (isFlatAppearanceMode !== undefined && isFlatAppearanceMode !== null) document.cookie = `${flatAppearanceModeCookieKey}=${isFlatAppearanceMode}${userSettingsCookieBasicOption}`;
		// HACK 8 在此处添加
	}
}

/**
 * 通过 useCookie 创建并返回一个 nuxt 响应式 cookie 对象，并在该响应式 cookie 的值被更新后调用 callback 方法 // TODO 目前只支持监听在程序代码中显式更新的 cookie，比如通过 cookie.value 为 cookie 重新赋值，而不支持在客户端浏览器中更新的 cookie，或许 nuxt 3.10 之后有办法解决
 * @param cookieKey cookie 的 key
 * @param callback cookie 被显示更新后调用的 callback
 * @param isWatchCookieRef 是否监听 cookie 的响应式变化并向调用 callback，默认不开启以免重复监听，请仅在需要监听时显式手动开启
 * @param isListenLoginEvent 是否监听用户 login（完成）事件，并在 login（完成）后，从 cookie 中同步最新的 cookie 值，默认不开启以免重复监听，请仅在需要监听时显式手动开启 // WARN 注意：开启此项会同时开启 isWatchCookieRef
 * @returns nuxt 响应式 cookie 对象
 */
export function useKiraCookie<T>(cookieKey: string, callback: (setting: T) => void, isWatchCookieRef: boolean = false, isListenLoginEvent: boolean = false): CookieRef<T> {
	const userSettingsCookieBasicOption = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false, watch: true };
	const cookie = useCookie<T>(cookieKey, userSettingsCookieBasicOption);

	try {
		const selfUserInfoStore = useSelfUserInfoStore();
		const appSettingsStore = useAppSettingsStore();
		const isAllowSyncThemeSettings = computed(() => appSettingsStore.isAllowSyncThemeSettings && selfUserInfoStore.isLogined);

		if (isWatchCookieRef || isListenLoginEvent)
			watch(cookie, cookieValue => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
				if (process.client) {
					window.localStorage.setItem(cookieKey, `${cookieValue}`); // WARN useStorage 更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟
					if (isAllowSyncThemeSettings.value) // 如果允许同步样式设置，则发送后端请求，非阻塞
						callback(cookieValue);
					cookieBinding();
				}
			});
		
		if (isListenLoginEvent)
			// 发生用户登录事件时，刷新 cookie（cookie 更新会触发 cookieBinding 更新页面样式，并且 nuxt 响应式 cookie 也绑定到一些开关上，此处也会在用户登录后更改开关的状态）
			useListen("user:login", () => {
				refreshCookie(cookieKey);
				// cookie.value = useCookie<T>(cookieKey, userSettingsCookieBasicOption).value; // TODO: nuxt 3.10 以后可以使用 refreshCookie 方法刷新 cookie，此行语句是否可以移除？
			});
	} catch (error) {
		console.error("ERROR", "ERROR in useKiraCookie");
	}

	return cookie;
}
