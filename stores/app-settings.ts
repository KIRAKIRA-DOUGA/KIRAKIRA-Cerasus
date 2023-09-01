export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		showCssDoodle: false,
		lastSettingPage: "appearance",
		sharpAppearanceMode: false,
		flatAppearanceMode: false,
		coloredSideBar: false,
	}),
	persist: true,
});
