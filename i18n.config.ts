export default defineI18nConfig(() => ({
	legacy: false,
	locale: "zh",
	messages: { // TODO: [艾拉] 将每个语言分别独立成单个文件。
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
