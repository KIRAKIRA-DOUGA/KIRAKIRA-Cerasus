/* eslint-disable import/order */
import en from "./locales/English";
import zhs from "./locales/Chinese Simplified";
import zht from "./locales/Chinese Traditional";
import ja from "./locales/Japanese";
import ko from "./locales/Korean";
import vi from "./locales/Vietnamese";
import id from "./locales/Indonesian";
import fr from "./locales/French";
import yue from "./locales/Cantonese";
import ii from "./locales/Sichuan Yi"; // 语境翻译工具伪语言

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "en",
	messages: {
		en,
		zhs,
		zht,
		ja,
		ko,
		vi,
		id,
		fr,
		yue,
		ii,
	},
	fallbackLocale: {
		zht: ["zhs"],
		yue: ["zht", "zhs"],
		default: ["en", "zhs", "zht", "ja"],
	},
}));
