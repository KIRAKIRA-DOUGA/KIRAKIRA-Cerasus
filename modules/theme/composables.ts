import type { CookieRef } from "nuxt/app";
import { PALETTE_LIST } from "./types";

/**
 * 服务端渲染时，获取请求时传递的用户 bootstrap hint cookie
 * 如果用户 bootstrap hint 通过验证，则请求最新用户设置并用最新值更新到 cookie 中（这回导致本次 SSR 渲染响应到达客户端时，客户端 cookie 也随之更新），然后续期 cookie
 * 如果用户 bootstrap hint 未通过验证，则续期 cookie
 * @returns 如果用户 bootstrap hint 通过验证，则返回最新用户设置，否则返回 undefined
 */
export async function cookieBaker() {
	// Cookie 键 - 用户认证
	const UID_COOKIE_KEY = "uid";
	const BOOTSTRAP_HINT_COOKIE_KEY = "user-data-bootstrap-hint";

	if (environment.server) { // 仅限服务端
		// Nuxt cookie 对象 - 用户认证
		const cookieUid = useCookie(UID_COOKIE_KEY, { sameSite: "lax" });	// NOTE: sameSite 是 lax 而不是 strict
		const cookieBootstrapHint = useCookie(BOOTSTRAP_HINT_COOKIE_KEY, { sameSite: "lax" }); // NOTE: sameSite 是 lax 而不是 strict

		// Nuxt cookie 对象 - 是否同步样式
		const isAllowSyncThemeSettings = useCookie<boolean>(COOKIE_KEY.isAllowSyncThemeSettings, DEFAULT_COOKIE_OPTION);

		// Nuxt cookie 对象 - 用户样式设置
		const cookieThemeType = useCookie(COOKIE_KEY.themeTypeCookieKey, DEFAULT_COOKIE_OPTION);
		const cookieThemeColor = useCookie(COOKIE_KEY.themeColorCookieKey, DEFAULT_COOKIE_OPTION);
		const cookieThemeColorCustom = useCookie(COOKIE_KEY.themeColorCustomCookieKey, DEFAULT_COOKIE_OPTION);
		const cookieColoredSidebar = useCookie<boolean>(COOKIE_KEY.coloredSidebarCookieKey, DEFAULT_COOKIE_OPTION);
		// HACK: 5 在此处添加

		// nuxt cookie 对象 - 是否使用离线样式设置
		const cookieIsLocalStorage = useCookie<boolean>(COOKIE_KEY.isOfflineSettingsCookieKey, DEFAULT_COOKIE_OPTION);

		const uid = parseInt(cookieUid.value ?? "-1", 10);
		const userDataBootstrapHint = cookieBootstrapHint.value;

		if (
			(
				typeof isAllowSyncThemeSettings.value === "boolean" && isAllowSyncThemeSettings.value ||
				typeof isAllowSyncThemeSettings.value === "string" && isAllowSyncThemeSettings.value === "true"
			) && uid && userDataBootstrapHint
		) {
			// 如果用户允许主题同步，且用户认证 cookie 存在，则通过认证 cookie 获取数据库中存储的用户样式设置，并将获取到的设置信息存储至 cookie
			const getUserBootstrapDataByHintRequest: GetUserBootstrapDataByHintRequestDto = {
				uid,
				userDataBootstrapHint,
			};
			const selfUserInfoStore = useSelfUserInfoStore();
			const appSettingsStore = useAppSettingsStore();
			const userBootstrapDataByHint = await api.user.getUserBootstrapDataByHint({ getUserBootstrapDataByHintRequest, appSettingsStore, selfUserInfoStore, headerCookie: undefined });

			if (!userBootstrapDataByHint || !userBootstrapDataByHint.success || !userBootstrapDataByHint.result)
				return undefined;

			cookieThemeType.value = userBootstrapDataByHint.result.themeType || THEME_ENV.SYSTEM_THEME;
			cookieThemeColor.value = userBootstrapDataByHint.result.themeColor ? (PALETTE_LIST as unknown as string[]).includes(userBootstrapDataByHint.result.themeColor) ? userBootstrapDataByHint.result.themeColor : THEME_ENV.CUSTOM_THEME_COLOR : THEME_ENV.DEFAULT_THEME_COLOR;
			cookieThemeColorCustom.value = userBootstrapDataByHint.result.themeColorCustom || THEME_ENV.DEFAULT_CUSTOM_THEME_COLOR;
			cookieColoredSidebar.value = userBootstrapDataByHint.result.coloredSideBar === true;
			// HACK: 6 在此处添加

			cookieIsLocalStorage.value = false;
		} else if (
			typeof isAllowSyncThemeSettings.value === "boolean" && isAllowSyncThemeSettings.value ||
			typeof isAllowSyncThemeSettings.value === "string" && isAllowSyncThemeSettings.value === "false"
		)
			cookieIsLocalStorage.value = true;
		else {
			isAllowSyncThemeSettings.value = true;
			cookieIsLocalStorage.value = true;
		}

		return undefined;
	}
}

/**
 * 设置浏览器 cookie 的辅助函数
 * @param cookieString - cookie 字符串
 */
function setCookie(cookieString: string) {
	// eslint-disable-next-line unicorn/no-document-cookie
	document.cookie = cookieString;
}

/**
 * 将用户设置追加到浏览器 cookie 中
 * @param userSettings - 用户设置
 */
export function saveUserSetting2BrowserCookieStore(userSettings: GetUserSettingsResponseDto) {
	if (environment.client) {
		const currentThemeType = userSettings?.userSettings?.themeType || THEME_ENV.SYSTEM_THEME;
		const themeColor = userSettings?.userSettings?.themeColor ? (PALETTE_LIST as unknown as string[]).includes(userSettings.userSettings.themeColor) ? userSettings.userSettings.themeColor : THEME_ENV.CUSTOM_THEME_COLOR : THEME_ENV.DEFAULT_THEME_COLOR;
		const themeColorCustom = userSettings?.userSettings?.themeColorCustom || "";
		const isColoredSidebar = userSettings?.userSettings?.coloredSideBar || false;
		// HACK: 7 在此处添加

		const userSettingsCookieBasicOption = `; expires=${new Date("9999/9/9").toUTCString()}; path=/; SameSite=Strict`;
		setCookie(`${COOKIE_KEY.isOfflineSettingsCookieKey}=false${userSettingsCookieBasicOption}`);
		if (currentThemeType) setCookie(`${COOKIE_KEY.themeTypeCookieKey}=${currentThemeType}${userSettingsCookieBasicOption}`);
		if (themeColor) setCookie(`${COOKIE_KEY.themeColorCookieKey}=${themeColor}${userSettingsCookieBasicOption}`);
		if (themeColorCustom) setCookie(`${COOKIE_KEY.themeColorCustomCookieKey}=${themeColorCustom}${userSettingsCookieBasicOption}`);
		if (isColoredSidebar !== undefined && isColoredSidebar !== null) setCookie(`${COOKIE_KEY.coloredSidebarCookieKey}=${isColoredSidebar}${userSettingsCookieBasicOption}`);
		// HACK: 8 在此处添加
	}
}

/**
 * useKiraCookie 函数的选项
 */
export type UseKiraCookieOptions = {
	/** 是否监听 cookie 的响应式变化将其同步至 localStorage，并调用 callback，默认不开启以免重复监听，请仅在需要监听时显式手动开启 */
	isWatchCookieRef?: boolean;
	/** 在已开启 isWatchCookieRef 的前提下，isSyncSettings 的值为 true 时，如果 cookie 发生响应式变化，并且用户开启了多端同步，则发送网络请求到后端，值为 false 时则一律不发送，默认为 true */
	isSyncSettings?: boolean;
	/**
	 * 是否监听用户 login（完成）事件，并在 login（完成）后，从 cookie 中同步最新的 cookie 值，默认不开启以免重复监听，请仅在需要监听时显式手动开启 // WARN: 注意：开启此项会同时开启 isWatchCookieRef
	 */
	isListenLoginEvent?: boolean;
	/** 如果不为假值，则防抖更新数据以及向后端同步数据，防抖的等待时间为该参数的值（单位：毫秒），默认为 undefined 不开启防抖 */
	debounceWait?: number;
};
/**
 * 通过 useCookie 创建并返回一个 nuxt 响应式 cookie 对象，并在该响应式 cookie 的值被更新后调用 callback 方法 // TODO: 目前只支持监听在程序代码中显式更新的 cookie，比如通过 cookie.value 为 cookie 重新赋值，而不支持在客户端浏览器中更新的 cookie，或许 nuxt 3.10 之后有办法解决
 * @template T - cookie 值的类型
 * @param cookieKey - cookie 的 key
 * @param callback - cookie 被显式更新后调用的 callback
 * @param options - 设置，详见 UseKiraCookieOptions
 * @returns nuxt 响应式 cookie 对象
 */
export function useKiraCookie<T>(
	cookieKey: string,
	callback: (setting: T) => void = () => {},
	{
		isWatchCookieRef = false,
		isSyncSettings = true,
		isListenLoginEvent = false,
		debounceWait = undefined,
	}: UseKiraCookieOptions = {}): CookieRef<T> {
	const userSettingsCookieBasicOption = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false, watch: true };
	const cookie = useCookie<T>(cookieKey, userSettingsCookieBasicOption);

	const isAllowSyncThemeSettingsCookieValue = useCookie<T>(COOKIE_KEY.isAllowSyncThemeSettings, userSettingsCookieBasicOption);

	try {
		const selfUserInfoStore = useSelfUserInfoStore();
		const isAllowSyncThemeSettings = computed(() => isAllowSyncThemeSettingsCookieValue.value && selfUserInfoStore.isLoggedIn && isSyncSettings);

		let correctCallback = callback;
		let correctCookieBinding = cookieBinding;
		if (debounceWait && debounceWait > 0) { // 如果正确设置了防抖时间，则以防抖方式调用，否则直接调用
			correctCallback = useDebounce(callback, debounceWait);
			correctCookieBinding = useDebounce(cookieBinding, debounceWait);
		}
		if (isWatchCookieRef || isListenLoginEvent)
			watch(cookie, cookieValue => { // 当设置值发送改变时，发送后端请求，并触发 cookieBinding 更新页面样式
				if (environment.client) {
					localStorage.setItem(cookieKey, `${cookieValue}`); // WARN: 使用 useStorage 函数更新数据会导致 cookieBinding 中获取到的 localStorage 数据不是最新数据，可能是 vue 响应式延迟，所以此处使用原始的 localStorage 对象
					if (isAllowSyncThemeSettings.value) // 如果允许同步样式设置，则发送后端请求，非阻塞
						correctCallback(cookieValue);
					correctCookieBinding();
				}
			});

		if (isListenLoginEvent)
			// 发生用户登录事件时，刷新 cookie（cookie 更新会触发 cookieBinding 更新页面样式，并且 nuxt 响应式 cookie 也绑定到一些开关上，此处也会在用户登录后更改开关的状态）
			useListen("user:login", () => {
				refreshCookie(cookieKey);
				// cookie.value = useCookie<T>(cookieKey, userSettingsCookieBasicOption).value; // TODO: nuxt 3.10 以后可以使用 refreshCookie 方法刷新 cookie，此行语句是否可以移除？
			});
	} catch (error) {
		console.error("ERROR", "Error in useKiraCookie", error);
	}

	return cookie;
}

/**
 * 存放向后端同步用户设置的方法的类
 */
export class SyncUserSettings {
	// HACK: 15 请参照此部分 ↓ ↓ ↓

	/**
	 * 发送更新用户的 ThemeType 设置的请求
	 * @param cookieValue - ThemeType 的新的值
	 */
	public static updateOrCreateUserThemeTypeSetting(cookieValue: ThemeSetType) {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			themeType: cookieValue,
		};
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}

	// HACK: 15 请参照此部分 ↑ ↑ ↑

	/**
	 * 发送更新用户的 ThemeColor 设置的请求
	 * @param cookieValue - ThemeColor 的新的值
	 */
	public static updateOrCreateUserThemeColorSetting(cookieValue: string) {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			themeColor: cookieValue,
		};
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}

	/**
	 * 发送更新用户的 ThemeColorCustom 设置的请求
	 * @param cookieValue - ThemeColor 的新的值
	 */
	public static updateOrCreateUserThemeColorCustomSetting(cookieValue: string) {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			themeColorCustom: cookieValue,
		};
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}

	/**
	 * 发送更新用户的 ColoredSidebar 设置的请求
	 * @param cookieValue - ColoredSidebar 的新的值
	 */
	public static updateOrCreateUserColoredSidebarSetting(cookieValue: boolean) {
		const updateOrCreateUserSettingsRequest: UpdateOrCreateUserSettingsRequestDto = {
			coloredSideBar: cookieValue,
		};
		api.user.updateUserSettings(updateOrCreateUserSettingsRequest);
	}

	// HACK: 15 在此处添加
}
