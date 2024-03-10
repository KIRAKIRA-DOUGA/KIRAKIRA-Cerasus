// WARN 在开始编写本文件之前，请参阅：modules\theme\README.md

// 默认 cookie 设置，该设置在 useCookie 时传入
export const DEFAULT_COOKIE_OPTION = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false };

// theme 默认值，请保持和下方 cookieBinding 函数中的局部变量的值一致
export const THEME_ENV = {
	SYSTEM_THEME: "system",
	DEFAULT_THEME_COLOR: "pink",
	CUSTOM_THEME_COLOR: "custom",
	// DEFAULT_CUSTOM_THEME_COLOR: "66CCFF", // TODO 设置默认自定义主题色
	THEME_DARK: "dark",
	THEME_LIGHT: "light",
	NO_COLORED_SIDEBAR: "false",
	NO_SHARP_APPEARANCE_MODE: "false",
	NO_FLAT_APPEARANCE_MODE: "false",
	// HACK 1 在此处添加
};

// Cookie 键 - 用户样式设置，请保持和下方 cookieBinding 函数中的局部变量的值一致
export const COOKIE_KEY = {
	isOfflineSettingsCookieKey: "is-offline-settings",
	themeTypeCookieKey: "theme-type",
	themeColorCookieKey: "theme-color",
	customThemeColorCookieKey: "custom-theme-color",
	coloredSidebarCookieKey: "colored-side-bar",
	sharpAppearanceModeCookieKey: "sharp-appearance-mode",
	flatAppearanceModeCookieKey: "flat-appearance-mode",
	// HACK 2 在此处添加
};

let lastClickMouseEvent: MouseEvent | undefined;
if (process.client)
	document.addEventListener("click", e => lastClickMouseEvent = e, true);

/**
 * 在 DOM 加载之前执行的脚本。
 */
export function cookieBinding() {
	// WARN 在开始编写本文件之前，请参考：modules\theme\README.md

	// theme 默认值，请保持和上方 THEME_ENV 全局变量的值一致
	const SYSTEM_THEME = "system";
	const DEFAULT_THEME_COLOR = "pink";
	const CUSTOM_THEME_COLOR = "custom";
	// const DEFAULT_CUSTOM_THEME_COLOR = "66CCFF"; // TODO 设置默认自定义主题色
	const THEME_DARK = "dark";
	const THEME_LIGHT = "light";
	const NO_COLORED_SIDEBAR = "false";
	const NO_SHARP_APPEARANCE_MODE = "false";
	const NO_FLAT_APPEARANCE_MODE = "false";
	// HACK 3 在此处添加

	// Cookie 键 - 用户样式设置，请保持和上方 COOKIE_KEY 全局变量的值一致
	const isOfflineSettingsCookieKey = "is-offline-settings";
	const themeTypeCookieKey = "theme-type";
	const themeColorCookieKey = "theme-color";
	const customThemeColorCookieKey = "custom-theme-color";
	const coloredSidebarCookieKey = "colored-side-bar";
	const sharpAppearanceModeCookieKey = "sharp-appearance-mode";
	const flatAppearanceModeCookieKey = "flat-appearance-mode";
	// HACK 4 在此处添加

	/**
	 * 用原始的方式获取 cookie
	 * @param cookieName key
	 * @returns cookie
	 */
	const getCookie = (cookieName: string): string => {
		const cookies = document.cookie.split("; ");
		for (let i = 0; i < cookies.length; i++) {
			const parts = cookies[i].split("=");
			if (parts[0] === cookieName)
				return parts[1];
		}
		return ""; // 如果没有找到指定的 cookie，返回 "" 空字符串
	};

	try {
		let currentThemeType; // 主题（浅色/深色）
		let themeColor; // 个性色
		let customThemeColor; // 用户自定义个性色
		let isColoredSidebar; // 是否启用彩色侧边栏
		let isSharpAppearanceMode; // 是否启用直角模式
		let isFlatAppearanceMode; // 是否启用扁平模式
		// HACK 9 在此处添加

		const isOfflineSettings = !getCookie(isOfflineSettingsCookieKey) || getCookie(isOfflineSettingsCookieKey) === "true";
		if (isOfflineSettings) { // 离线样式，从 localStorage 中获取样式并拷贝到 cookie 中
			// 获取 localStorage 中的用户样式设置
			currentThemeType = window.localStorage.getItem(themeTypeCookieKey) || THEME_LIGHT; // localStorage 中存储的系统主题类型，如果没有或值为 system，则使用 systemThemeType
			themeColor = window.localStorage.getItem(themeColorCookieKey) || DEFAULT_THEME_COLOR; // localStorage 中存储的系统主题色
			customThemeColor = window.localStorage.getItem(customThemeColorCookieKey) || DEFAULT_THEME_COLOR; // localStorage 中存储的自定义系统主题色（当 themeColor 的值为 CUSTOM_THEME_COLOR 时才应该依据该值渲染）
			isColoredSidebar = window.localStorage.getItem(coloredSidebarCookieKey) || NO_COLORED_SIDEBAR; // localStorage 中存储的是否启用彩色侧边栏
			isSharpAppearanceMode = window.localStorage.getItem(sharpAppearanceModeCookieKey) || NO_SHARP_APPEARANCE_MODE; // localStorage 中存储的是否启用直角模式
			isFlatAppearanceMode = window.localStorage.getItem(flatAppearanceModeCookieKey) || NO_FLAT_APPEARANCE_MODE; // localStorage 中存储的是否启用扁平模式
			// HACK 10 在此处添加

			// 将最新的 localStorage 存储回 cookie
			const userSettingsCookieBasicOption = `; expires=${new Date("9999/9/9").toUTCString()}; path=/; SameSite=Strict`;
			if (currentThemeType) document.cookie = `${themeTypeCookieKey}=${currentThemeType}${userSettingsCookieBasicOption}`;
			if (themeColor) document.cookie = `${themeColorCookieKey}=${themeColor}${userSettingsCookieBasicOption}`;
			if (customThemeColor) document.cookie = `${customThemeColorCookieKey}=${customThemeColor}${userSettingsCookieBasicOption}`;
			if (isColoredSidebar !== undefined && isColoredSidebar !== null) document.cookie = `${coloredSidebarCookieKey}=${isColoredSidebar}${userSettingsCookieBasicOption}`;
			if (isSharpAppearanceMode !== undefined && isSharpAppearanceMode !== null) document.cookie = `${sharpAppearanceModeCookieKey}=${isSharpAppearanceMode}${userSettingsCookieBasicOption}`;
			if (isFlatAppearanceMode !== undefined && isFlatAppearanceMode !== null) document.cookie = `${flatAppearanceModeCookieKey}=${isFlatAppearanceMode}${userSettingsCookieBasicOption}`;
			// HACK 11 在此处添加
		} else { // 在线（远程同步）样式，从 cookie 中获取样式并拷贝到 localStorage 中
			// 获取 cookie 中的用户样式设置
			currentThemeType = (getCookie(themeTypeCookieKey) || THEME_LIGHT) as ThemeSetType; // cookie 中存储的系统主题类型，如果没有，则使用 systemThemeType
			themeColor = (getCookie(themeColorCookieKey) || DEFAULT_THEME_COLOR) as PaletteType; // cookie 中存储的系统主题色
			customThemeColor = (getCookie(customThemeColorCookieKey) || DEFAULT_THEME_COLOR) as string; // cookie 中存储的自定义系统主题色（当 themeColor 的值为 CUSTOM_THEME_COLOR 时才应该依据该值渲染）
			isColoredSidebar = (getCookie(coloredSidebarCookieKey) || NO_COLORED_SIDEBAR); // cookie 中存储的是否启用彩色侧边栏
			isSharpAppearanceMode = (getCookie(sharpAppearanceModeCookieKey) || NO_SHARP_APPEARANCE_MODE); // cookie 中存储的是否启用直角模式
			isFlatAppearanceMode = (getCookie(flatAppearanceModeCookieKey) || NO_FLAT_APPEARANCE_MODE); // cookie 中存储的是否启用扁平模式
			// HACK 12 在此处添加

			// 将最新的 cookie 存储回 localStorage（以备以后用户登出后使用）
			if (currentThemeType) window.localStorage.setItem(themeTypeCookieKey, currentThemeType); else window.localStorage.setItem(themeTypeCookieKey, THEME_LIGHT);
			if (themeColor) window.localStorage.setItem(themeColorCookieKey, themeColor); else window.localStorage.setItem(themeColorCookieKey, DEFAULT_THEME_COLOR);
			if (customThemeColor) window.localStorage.setItem(customThemeColorCookieKey, customThemeColor); else window.localStorage.setItem(customThemeColorCookieKey, DEFAULT_THEME_COLOR);
			if (isColoredSidebar !== undefined && isColoredSidebar !== null) window.localStorage.setItem(coloredSidebarCookieKey, `${isColoredSidebar}`); else window.localStorage.setItem(coloredSidebarCookieKey, NO_COLORED_SIDEBAR);
			if (isSharpAppearanceMode !== undefined && isSharpAppearanceMode !== null) window.localStorage.setItem(sharpAppearanceModeCookieKey, `${isSharpAppearanceMode}`); else window.localStorage.setItem(sharpAppearanceModeCookieKey, NO_SHARP_APPEARANCE_MODE);
			if (isFlatAppearanceMode !== undefined && isFlatAppearanceMode !== null) window.localStorage.setItem(flatAppearanceModeCookieKey, `${isFlatAppearanceMode}`); else window.localStorage.setItem(flatAppearanceModeCookieKey, NO_FLAT_APPEARANCE_MODE);
			// HACK 13 在此处添加
		}

		const systemThemeType = window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_DARK : THEME_LIGHT; // 获取系统主题类型（当 themeType 的值为 system 时才应该依据该值渲染）

		// 绑定 cookie 中的样式到 html
		const rootNode = document.documentElement;
		const isPreviousDark = rootNode.classList.contains("dark");
		rootNode.className = "kirakira";
		if (`${isColoredSidebar}` === "true") rootNode.classList.add("colored-sidebar");
		if (`${isSharpAppearanceMode}` === "true") rootNode.classList.add("sharp");
		if (`${isFlatAppearanceMode}` === "true") rootNode.classList.add("flat");
		if (themeColor && themeColor === CUSTOM_THEME_COLOR && customThemeColor)
			console.log("customThemeColor", customThemeColor); // TODO 设置自定义主题色
		else if (themeColor)
			rootNode.classList.add(themeColor);
		if (currentThemeType) {
			const actualThemeType = currentThemeType === "system" ? systemThemeType : currentThemeType;
			const isDark = actualThemeType === "dark";
			const updateThemeSettings = () => {
				rootNode.classList.toggle("dark", isDark);
				rootNode.classList.toggle("light", !isDark);
			};

			if (typeof lastClickMouseEvent !== "undefined" && lastClickMouseEvent && isPreviousDark !== isDark) {
				if (isPreviousDark) rootNode.classList.add("dark");
				else rootNode.classList.add("light");
				const { x, y } = lastClickMouseEvent;
				const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
				const clipPath = [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${endRadius}px at ${x}px ${y}px)`,
				];
				const CHANGING_THEME_CLASS = "changing-theme";
				rootNode.classList.add(CHANGING_THEME_CLASS);
				startColorViewTransition(updateThemeSettings, {
					clipPath: actualThemeType === "light" ? clipPath : clipPath.toReversed(),
				}, {
					duration: 300,
					easing: eases.easeInOutSmooth,
					pseudoElement: actualThemeType === "light" ? "::view-transition-new(root)" : "::view-transition-old(root)",
				}).then(() => {
					rootNode.classList.remove(CHANGING_THEME_CLASS);
				});
			} else updateThemeSettings();
		}
		// HACK 14 在此处添加
	} catch (error) {
		console.error("ERROR", "ERROR IN cookieBinding", error);
		try {
			document.documentElement.classList.add(SYSTEM_THEME, THEME_LIGHT);
		} catch (error) {
			console.error("ERROR", "ERROR IN cookieBinding -> catch", error);
		}
	}
}
