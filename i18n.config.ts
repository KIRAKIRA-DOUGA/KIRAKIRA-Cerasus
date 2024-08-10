import zhs from "locales/Chinese Simplified";
import zht from "locales/Chinese Traditional";
import en from "locales/English";
import ja from "locales/Japanese";
import ko from "locales/Korean";
import vi from "locales/Vietnamese";
import id from "locales/Indonesian";
import fr from "locales/French";
import yue from "locales/Cantonese";

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
		fr,
		yue,
	},
	fallbackLocale: {
		zht: ["zhs"],
		yue: ["zht", "zhs"],
		default: ["en", "zhs", "zht", "ja"],
	},
}));
