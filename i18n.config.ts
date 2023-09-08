import en from "locales/English";
import ja from "locales/Japanese";
import ko from "locales/Korean";
import zhs from "locales/SChinese";
import zht from "locales/TChinese";
import vi from "locales/Vietnamese";

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
	},
}));
