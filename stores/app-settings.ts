export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		showCssDoodle: false,
		lastSettingPage: "appearance",
		exitSettingRoute: "/",
		sharpAppearanceMode: false,
		flatAppearanceMode: false,
		coloredSideBar: false,
	}),
	getters: {
		getExitSettingRoute: state => {
			let route = state.exitSettingRoute;
			if (!route.startsWith("/")) route = "/" + route;
			return route;
		},
	},
	persist: {
		storage: persistedState.cookiesWithOptions({
			sameSite: "strict",
		}),
	},
});
