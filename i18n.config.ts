import en from "locales/English";
import ja from "locales/Japanese";
import zh from "locales/SChinese";

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "zh",
	messages: {
		zh: {
			home: "首页",
			anime: "动画",
			music: "音乐",
			otomad: "音MAD",
		},
		en,
		ja,
	},
}));
