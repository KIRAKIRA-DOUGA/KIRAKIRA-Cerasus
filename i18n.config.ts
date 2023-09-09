import zhs from "locales/SChinese";
import zht from "locales/TChinese";
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
}));
