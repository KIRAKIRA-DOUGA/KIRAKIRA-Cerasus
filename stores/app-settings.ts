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
