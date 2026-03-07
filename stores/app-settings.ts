export const useAppSettingsStore = defineStore("app-settings", {
	state: () => ({
		lastSettingPage: "appearance",
		exitSettingRoute: "/",

		isOpenVideoInNewTab: false, // 是否在新标签页打开视频
		akkarinGuestAvatar: false,
		relativeDate: false,

		backgroundImage: {
			imageIndex: -1,
			opacity: 0.2,
			tint: 0.75,
			blur: 0,
		},

		player: {
			autoplay: false,
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
			controller: {
				showStop: false,
				showReplay: false,
				showFrameByFrame: false,
				autoResumePlayAfterSeeking: false,
			},
			quality: {
				auto: true,
				preferred: 0,
			},
		},

		search: {
			isDynamicUrl: true, // 是否在用户更改搜索条件时动态更新 URL 以便用户分享搜索，默认为 true
		},

		authenticatorType: "none", // 2FA 的类型
	}),
	getters: {
		getExitSettingRoute: state => {
			let route = state.exitSettingRoute;
			if (!route.startsWith("/")) route = "/" + route;
			return route;
		},
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	},
});
