import en from "locales/English";
import ja from "locales/Japanese";
import zh_Hans from "locales/SChinese";

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "zh_Hans",
	messages: {
		zh_Hans,
		en,
		ja,
	},
}));
