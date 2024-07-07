export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		showCssDoodle: false,
		sharpAppearanceMode: false,
		flatAppearanceMode: false,

		lastSettingPage: "appearance",
		exitSettingRoute: "/",

		// DELETE: 以下内容已搬迁至 /modules/theme/theme-cookie-binding.ts，不再使用 pinia 储存。
		// themeType: "system",
		// themeColor: "pink",
		// customThemeColor: "",
		// coloredSideBar: false,

		backgroundImage: {
			image: {
				name: "",
				data: "",
			},
			opacity: 0.2,
			tint: 0.75,
			blur: 0,
		},

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
