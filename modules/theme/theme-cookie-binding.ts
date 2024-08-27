// WARN 在开始编写本文件之前，请参阅：modules\theme\README.md

// 默认 cookie 设置，该设置在 useCookie 时传入
export const DEFAULT_COOKIE_OPTION = { expires: new Date("9999/9/9"), sameSite: true, httpOnly: false };

// theme 常量或默认值，请保持和下方 cookieBinding 函数中的局部变量的值一致
export const THEME_ENV = {
	SYSTEM_THEME: "system",
	DEFAULT_THEME_COLOR: "pink",
	CUSTOM_THEME_COLOR: "custom",
	DEFAULT_CUSTOM_THEME_COLOR: "f06e8e",
	THEME_DARK: "dark",
	THEME_LIGHT: "light",
	NO_COLORED_SIDEBAR: "false",
	NO_SHARP_APPEARANCE_MODE: "false",
	NO_FLAT_APPEARANCE_MODE: "false",
	ALLOW_SYNC_THEME_SETTINGS: "true",
	// HACK: 1 在此处添加
};

// Cookie 键 - 用户样式设置，请保持和下方 cookieBinding 函数中的局部变量的值一致
export const COOKIE_KEY = {
	isOfflineSettingsCookieKey: "is-offline-settings",
	themeTypeCookieKey: "theme-type",
	themeColorCookieKey: "theme-color",
	themeColorCustomCookieKey: "theme-color-custom",
	coloredSidebarCookieKey: "colored-side-bar",
	sharpAppearanceModeCookieKey: "sharp-appearance-mode",
	flatAppearanceModeCookieKey: "flat-appearance-mode",
	isAllowSyncThemeSettings: "is-allow-sync-theme-settings",
	// HACK: 2 在此处添加
};

let lastClickMouseEvent: MouseEvent | undefined;
if (process.client)
	document.addEventListener("click", e => lastClickMouseEvent = e, true);

/**
 * 在 DOM 加载之前执行的脚本。
 */
export function cookieBinding() {
	// WARN: 在开始编写本文件之前，请参考：modules\theme\README.md

	// theme 常量或默认值，请保持和上方 THEME_ENV 全局变量的值一致
	const SYSTEM_THEME = "system";
	const DEFAULT_THEME_COLOR = "pink";
	const THEME_COLOR_CUSTOM = "custom";
	const DEFAULT_CUSTOM_THEME_COLOR = "f06e8e";
	const THEME_DARK = "dark";
	const THEME_LIGHT = "light";
	const NO_COLORED_SIDEBAR = "false";
	const NO_SHARP_APPEARANCE_MODE = "false";
	const NO_FLAT_APPEARANCE_MODE = "false";
	const ALLOW_SYNC_THEME_SETTINGS = "true";
	// HACK: 3 在此处添加

	// Cookie 键 - 用户样式设置，请保持和上方 COOKIE_KEY 全局变量的值一致
	const isOfflineSettingsCookieKey = "is-offline-settings";
	const themeTypeCookieKey = "theme-type";
	const themeColorCookieKey = "theme-color";
	const themeColorCustomCookieKey = "theme-color-custom";
	const coloredSidebarCookieKey = "colored-side-bar";
	const sharpAppearanceModeCookieKey = "sharp-appearance-mode";
	const flatAppearanceModeCookieKey = "flat-appearance-mode";
	const isAllowSyncThemeSettingsCookieKey = "is-allow-sync-theme-settings"; // useless
	// HACK: 4 在此处添加

	/**
	 * 创建或更新一个 meta 标签
	 * @param name meta 标签的 name
	 * @param content meta 标签的 content
	 */
	function updateOrCreateMetaTag(name: string, content: string) {
		// 尝试找到已存在的 meta 标签
		let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

		if (meta) // 如果标签已存在，更新它的内容
			meta.content = content;
		else { // 如果标签不存在，创建一个新的标签并设置其属性
			meta = document.createElement("meta");
			meta.name = name;
			meta.content = content;
			document.head.appendChild(meta);
		}
	}

	/**
	 * 用 JavaScript 原生方式获取 Cookie。
	 * @param cookieKey - Cookie 的键名。
	 * @returns Cookie 的值。
	 */
	function getCookie(cookieKey: string) {
		const cookies = document.cookie.split("; ");
		for (const cookie of cookies) {
			const [key, value] = cookie.split("=");
			if (key === cookieKey)
				return value;
		}
		return ""; // 如果没有找到指定的 cookie，返回 "" 空字符串
	}

	try {
		const isAllowSyncThemeSettings = getCookie(isAllowSyncThemeSettingsCookieKey) as ThemeSetType || ALLOW_SYNC_THEME_SETTINGS;
		localStorage.setItem(isAllowSyncThemeSettingsCookieKey, isAllowSyncThemeSettings || ALLOW_SYNC_THEME_SETTINGS);
	} catch (error) {
		console.error("ERROR", "Error in cookieBinding 'isAllowSyncThemeSettings'", error);
	}

	try {
		let currentThemeType: ThemeSetType | undefined; // 主题（浅色/深色）
		let themeColor: PaletteType | undefined; // 个性色
		let themeColorCustom: string | undefined; // 用户自定义个性色
		let isColoredSidebar: BooleanString | undefined; // 是否启用彩色侧边栏
		let isSharpAppearanceMode: BooleanString | undefined; // 是否启用直角模式
		let isFlatAppearanceMode: BooleanString | undefined; // 是否启用扁平模式
		// HACK: 9 在此处添加

		const isOfflineSettings = !getCookie(isOfflineSettingsCookieKey) || getCookie(isOfflineSettingsCookieKey) === "true";
		if (isOfflineSettings) { // 离线样式，从 localStorage 中获取样式并拷贝到 cookie 中
			// 获取 localStorage 中的用户样式设置
			// localStorage 中存储的系统主题类型，如果没有或值为 system，则使用 systemThemeType
			currentThemeType = localStorage.getItem(themeTypeCookieKey) as ThemeSetType || SYSTEM_THEME;
			// localStorage 中存储的系统主题色
			themeColor = localStorage.getItem(themeColorCookieKey) as PaletteType || DEFAULT_THEME_COLOR;
			// localStorage 中存储的自定义系统主题色（当 themeColor 的值为 CUSTOM_THEME_COLOR 时才应该依据该值渲染）
			themeColorCustom = localStorage.getItem(themeColorCustomCookieKey) || DEFAULT_CUSTOM_THEME_COLOR;
			// localStorage 中存储的是否启用彩色侧边栏
			isColoredSidebar = localStorage.getItem(coloredSidebarCookieKey) as BooleanString || NO_COLORED_SIDEBAR;
			// localStorage 中存储的是否启用直角模式
			isSharpAppearanceMode = localStorage.getItem(sharpAppearanceModeCookieKey) as BooleanString || NO_SHARP_APPEARANCE_MODE;
			// localStorage 中存储的是否启用扁平模式
			isFlatAppearanceMode = localStorage.getItem(flatAppearanceModeCookieKey) as BooleanString || NO_FLAT_APPEARANCE_MODE;
			// HACK: 10 在此处添加

			// 将最新的 localStorage 存储回 cookie
			const setIfCookie = (key: string, value: string) => {
				const userSettingsCookieBasicOption = `; expires=${new Date("9999/9/9").toUTCString()}; path=/; SameSite=Strict`;
				if (value) document.cookie = `${key}=${value}${userSettingsCookieBasicOption}`;
			};

			setIfCookie(themeTypeCookieKey, currentThemeType);
			setIfCookie(themeColorCookieKey, themeColor);
			setIfCookie(themeColorCustomCookieKey, themeColorCustom);
			setIfCookie(coloredSidebarCookieKey, isColoredSidebar);
			setIfCookie(sharpAppearanceModeCookieKey, isSharpAppearanceMode);
			setIfCookie(flatAppearanceModeCookieKey, isFlatAppearanceMode);
			// HACK: 11 在此处添加
		} else { // 在线（远程同步）样式，从 cookie 中获取样式并拷贝到 localStorage 中
			// 获取 cookie 中的用户样式设置
			// cookie 中存储的系统主题类型，如果没有，则使用 systemThemeType
			currentThemeType = getCookie(themeTypeCookieKey) as ThemeSetType || SYSTEM_THEME;
			// cookie 中存储的系统主题色
			themeColor = getCookie(themeColorCookieKey) as PaletteType || DEFAULT_THEME_COLOR;
			// cookie 中存储的自定义系统主题色（当 themeColor 的值为 CUSTOM_THEME_COLOR 时才应该依据该值渲染）
			themeColorCustom = getCookie(themeColorCustomCookieKey) || DEFAULT_CUSTOM_THEME_COLOR;
			// cookie 中存储的是否启用彩色侧边栏
			isColoredSidebar = getCookie(coloredSidebarCookieKey) as BooleanString || NO_COLORED_SIDEBAR;
			// cookie 中存储的是否启用直角模式
			isSharpAppearanceMode = getCookie(sharpAppearanceModeCookieKey) as BooleanString || NO_SHARP_APPEARANCE_MODE;
			// cookie 中存储的是否启用扁平模式
			isFlatAppearanceMode = getCookie(flatAppearanceModeCookieKey) as BooleanString || NO_FLAT_APPEARANCE_MODE;
			// HACK: 12 在此处添加

			// 将最新的 cookie 存储回 localStorage（以备以后用户登出后使用）
			localStorage.setItem(themeTypeCookieKey, currentThemeType || SYSTEM_THEME);
			localStorage.setItem(themeColorCookieKey, themeColor || DEFAULT_THEME_COLOR);
			localStorage.setItem(themeColorCustomCookieKey, themeColorCustom || DEFAULT_THEME_COLOR);
			localStorage.setItem(coloredSidebarCookieKey, isColoredSidebar || NO_COLORED_SIDEBAR);
			localStorage.setItem(sharpAppearanceModeCookieKey, isSharpAppearanceMode || NO_SHARP_APPEARANCE_MODE);
			localStorage.setItem(flatAppearanceModeCookieKey, isFlatAppearanceMode || NO_FLAT_APPEARANCE_MODE);
			// HACK: 13 在此处添加
		}

		const systemThemeType = window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_DARK : THEME_LIGHT; // 获取系统主题类型（当 themeType 的值为 system 时才应该依据该值渲染）

		// 绑定 cookie 中的样式到 html
		const rootNode = document.documentElement;
		const isPreviousDark = rootNode.classList.contains("dark");
		rootNode.className = "";
		if (isColoredSidebar === "true") rootNode.classList.add("colored-sidebar");
		if (isSharpAppearanceMode === "true") rootNode.classList.add("sharp");
		if (isFlatAppearanceMode === "true") rootNode.classList.add("flat");
		if (themeColor) {
			if (themeColor === THEME_COLOR_CUSTOM && themeColorCustom) { // 如果 themeColor 的值是 custom 且 themeColorCustom 为真值，则使用自定义主题色。
				rootNode.classList.add("no-color-transition");
				rootNode.style.setProperty("--accent-50", `#${themeColorCustom}`);
				setTimeout(() => rootNode.classList.remove("no-color-transition"), 5);
			} else { // 否则移除自定义主题色并将主题设置为用户选中的官方主题色。
				rootNode.style.removeProperty("--accent-50");
				rootNode.classList.add("no-color-transition");
				rootNode.classList.add(themeColor);
				setTimeout(() => rootNode.classList.remove("no-color-transition"), 5);
			}
			const themeColorMetaTagName = "theme-color";
			const themeColorCssPropertyName = "--accent-50";
			const themeColorHex = getComputedStyle(rootNode).getPropertyValue(themeColorCssPropertyName).trim();
			updateOrCreateMetaTag(themeColorMetaTagName, themeColorHex);
		}
		if (currentThemeType) {
			const actualThemeType = currentThemeType === "system" ? systemThemeType : currentThemeType;
			const isDark = actualThemeType === "dark";
			const updateThemeSettings = () => {
				rootNode.classList.toggle("dark", isDark);
				rootNode.classList.toggle("light", !isDark);
			};

			if (typeof lastClickMouseEvent !== "undefined" && isPreviousDark !== isDark) {
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
		// HACK: 14 在此处添加
	} catch (error) {
		console.error("ERROR", "Error in cookieBinding", error);
		try {
			document.documentElement.classList.add(SYSTEM_THEME, THEME_LIGHT);
		} catch (error) {
			console.error("ERROR", "Error in cookieBinding -> catch", error);
		}
	}
}
