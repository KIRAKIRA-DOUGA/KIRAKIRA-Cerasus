export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		showCssDoodle: false,
		lastSettingPage: "appearance",
	}),
	persist: true,
});
