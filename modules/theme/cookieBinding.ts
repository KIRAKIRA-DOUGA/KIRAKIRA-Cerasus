// theme 关键字
export const COOKIE_NOT_FOUND = "404";
export const SYSTEM_THEME = "system";
export const DEFAULT_THEME_COLOR = "pink";
export const CUSTOMER_THEME_COLOR = "customer";
export const DEFAULT_CUSTOMER_THEME_COLOR = "66CCFF"; // TODO 设置默认自定义主题色
export const THEME_DARK = "dark";
export const THEME_LIGHT = "light";

// Cookie 键 - 用户样式设置
export const themeTypeCookieKey = "theme-type";
export const themeColorCookieKey = "theme-color";
export const customerThemeColorCookieKey = "customer-theme-color";
export const coloredSidebarCookieKey = "colored-side-bar";

/**
 * 在 DOM 加载之前执行的脚本。
 * @param autoCall - 是否自启动？
 */
export function cookieBinding() {
	// theme 关键字，请和上方全局变量中的一致
	const COOKIE_NOT_FOUND = "404";
	const SYSTEM_THEME = "system";
	const DEFAULT_THEME_COLOR = "pink";
	const CUSTOMER_THEME_COLOR = "customer";
	// const DEFAULT_CUSTOMER_THEME_COLOR = "66CCFF"; // TODO 设置默认自定义主题色
	const THEME_DARK = "dark";
	const THEME_LIGHT = "light";

	// Cookie 键 - 用户样式设置，请和上方全局变量中的一致
	const themeTypeCookieKey = "theme-type";
	const themeColorCookieKey = "theme-color";
	const customerThemeColorCookieKey = "customer-theme-color";
	const coloredSidebarCookieKey = "colored-side-bar";

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

	/**
	 * 深层数据挖掘机 - 如果你要获取的 cookie 的值为 COOKIE_NOT_FOUND 时，则尝试去 localStorage 中获取
	 * @param cookieName key
	 * @returns 根据 cookieName 去 cookie 或者 localStorage 中获取的数据
	 */
	const deepDataMiner = (cookieName: string): string => {
		const cookieValue = getCookie(cookieName);
		if (cookieValue === COOKIE_NOT_FOUND)
			return window.localStorage.getItem(cookieName) || "";
		else
			return cookieValue;
	};

	try {
		// 调用深层数据挖掘机，尽可能地获取 cookie 或 localStorage 中的用户样式设置
		const systemThemeType = window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_DARK : THEME_LIGHT; // 获取系统主题类型（当 themeType 的值为 system 时才应该依据该值渲染）
		const currentThemeType = (deepDataMiner(themeTypeCookieKey) || systemThemeType) as ThemeSetType; // 客户端中存储的系统主题类型，如果没有，则使用 systemThemeType

		const themeColor = (deepDataMiner(themeColorCookieKey) || DEFAULT_THEME_COLOR) as PaletteType; // 客户端中存储的系统主题色
		const customerThemeColor = deepDataMiner(customerThemeColorCookieKey) as string; // 客户端中存储的自定义系统主题色（当 themeColor 的值为 CUSTOMER_THEME_COLOR 时才应该依据该值渲染）

		const isColoredSidebar = deepDataMiner(coloredSidebarCookieKey) === "true"; // 客户端中存储的是否启用彩色侧边栏

		// 开始绑定样式
		const rootNode = document.documentElement;
		rootNode.className = "kirakira";
		if (currentThemeType) rootNode.classList.add(currentThemeType);
		if (themeColor === CUSTOMER_THEME_COLOR && customerThemeColor)
			// TODO 设置自定义主题色
			console.log("themeCustomerColor", customerThemeColor);
		else
			rootNode.classList.add(themeColor);
		if (isColoredSidebar) rootNode.classList.add("colored-sidebar");

		// TODO // FIXME 用户在未登录或为开启多端同步的状态下存在问题：虽然 cookie 被设为 404 后，正确地从 localStorage 中获取值了，但 cookie 仍为 404，在下次渲染时会把 404 发送到服务端
		// 将最新的 cookie 存储回 localStorage
		if (currentThemeType) window.localStorage.setItem(themeTypeCookieKey, currentThemeType);
		if (themeColor) window.localStorage.setItem(themeColorCookieKey, themeColor);
		if (customerThemeColor) window.localStorage.setItem(customerThemeColorCookieKey, customerThemeColor);
		if (isColoredSidebar) window.localStorage.setItem(coloredSidebarCookieKey, `${isColoredSidebar}`);
	} catch (error) {
		console.error("ERROR", "ERROR IN cookieBander", error);
		try {
			document.documentElement.classList.add(SYSTEM_THEME, THEME_LIGHT);
		} catch (error) {
			console.error("ERROR", "ERROR IN cookieBander -> catch", error);
		}
	}
}
