export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		showCssDoodle: false,
		lastSettingPage: "appearance",
		exitSettingRoute: "/",
		sharpAppearanceMode: false,
		flatAppearanceMode: false,

		themeType: "system",
		themeColor: "pink",
		customerThemeColor: "",
		coloredSideBar: false,

		/** 已登录用户是否允许在多设备上同步主题设置 */
		isAllowSyncThemeSettings: false,
	}),
	getters: {
		getExitSettingRoute: state => {
			let route = state.exitSettingRoute;
			if (!route.startsWith("/")) route = "/" + route;
			return route;
		},
	},
	persist: true,
});
