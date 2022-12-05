export default defineAppConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: "zh-cmn-Hans-CN", // 中文-普通话-简体字-大陆地区
			},
			bodyAttrs: {
				id: "root",
			},
			titleTemplate: "%s - KiRAKiRA☆DOUGA",
			link: [
				{ rel: "icon", type: "image/vnd.microsoft.icon", href: "/favicon.ico" }, // 不是 image/x-icon
			],
		},
	},
});
