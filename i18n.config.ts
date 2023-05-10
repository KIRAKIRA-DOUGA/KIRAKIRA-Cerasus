export default defineI18nConfig(() => ({ // TODO: 现在i18使用的是临时版本，不然无法正常运行。https://github.com/nuxt-modules/i18n/issues/2016
	legacy: false,
	locale: "zh",
	messages: { // TODO: 将每个语言分别独立成单个文件。
		zh: {
			welcome: "欢迎",
		},
		en: {
			welcome: "Welcome",
		},
		jp: {
			welcome: "歓迎",
		},
	},
}));
