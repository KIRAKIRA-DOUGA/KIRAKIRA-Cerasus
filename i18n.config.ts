import zhs from "locales/Simplified Chinese";
import zht from "locales/Traditional Chinese";
import en from "locales/English";
import ja from "locales/Japanese";
import ko from "locales/Korean";
import vi from "locales/Vietnamese";
import id from "locales/Indonesian";

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "zhs",
	messages: {
		zhs,
		zht,
		en,
		ja,
		ko,
		vi,
		id,
	},
	fallbackLocale: {
		zht: ["zhs"],
		default: ["en", "zhs", "zht", "ja"],
	},
}));
