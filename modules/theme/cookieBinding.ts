/**
 * 在 DOM 加载之前执行的脚本。
 * @param autoCall - 是否自启动？
 */
export function cookieBander() {
	/**
	 * 用原始的方式获取 cookie
	 * @param cookieName key
	 * @returns cookie
	 */
	const getCookie = (cookieName: string) => {
		const cookies = document.cookie.split("; ");
		for (let i = 0; i < cookies.length; i++) {
			const parts = cookies[i].split("=");
			if (parts[0] === cookieName)
				return parts[1];
		}
		return ""; // 如果没有找到指定的 cookie，返回 "" 空字符串
	};

	try {
		const themeType = (getCookie("theme-type") || "system") as ThemeSetType; // cookie 中存储的系统主题类型
		const systemThemeType = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; // 获取系统主题类型（当 themeType 的值为 system 时才应该依据该值渲染）
		const currentThemeType = themeType === "system" ? systemThemeType : themeType; // 用户最终应该使用的主题类型

		const themeColor = (getCookie("theme-color") || "pink") as PaletteType; // cookie 中存储的系统主题色
		const customerThemeColor = getCookie("customer-theme-color") as string; // cookie 中存储的自定义系统主题色（当 themeColor 的值为 custom 时才应该依据该值渲染）

		const isColoredSidebar = getCookie("colored-side-bar") === "true"; // cookie 中存储的是否启用彩色侧边栏

		// 开始绑定样式
		const rootNode = document.documentElement;
		rootNode.className = "kirakira";
		if (currentThemeType) rootNode.classList.add(currentThemeType);
		if (themeColor === "custom" && customerThemeColor)
			// TODO 设置自定义主题色
			console.log("themeCustomerColor", customerThemeColor);
		else
			rootNode.classList.add(themeColor);
		if (isColoredSidebar) rootNode.classList.add("colored-sidebar");
	} catch (error) {
		console.error("ERROR", "ERROR IN cookieBander", error);
		try {
			document.documentElement.classList.add("system", "light");
		} catch (error) {
			console.error("ERROR", "ERROR IN cookieBander -> catch", error);
		}
	}
}
