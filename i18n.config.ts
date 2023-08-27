import en from "locales/English";
import ja from "locales/Japanese";
import zhs from "locales/SChinese";

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "zhs",
	messages: {
		zhs,
		en,
		ja,
	},
}));
