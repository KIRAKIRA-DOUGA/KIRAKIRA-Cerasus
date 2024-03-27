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
		player: {
			audio: {
				volume: 1,
				muted: false,
			},
			rate: {
				preservesPitch: false,
				continuousControl: false,
			},
			danmaku: {
				opacity: 1,
				fontSizeScale: 1,
			},
		},
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
