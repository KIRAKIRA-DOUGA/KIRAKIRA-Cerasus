export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		showCssDoodle: false,
		lastSettingPage: "appearance",
		sharpAppearanceMode: false,
		flatAppearanceMode: false,
	}),
	persist: true,
});
