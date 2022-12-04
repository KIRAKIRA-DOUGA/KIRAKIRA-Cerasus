export default defineAppConfig({
	head: {
		head: {
			htmlAttres: {
				lang: "zh-cmn-Hans-CN", // 中文-普通话-简体字-大陆地区
			},
			bodyAttres: {
				id: "root",
			},
			title: "KiRAKiRA☆DOUGA",
			link: [
				{ rel: "icon", type: "image/vnd.microsoft.icon", href: "/favicon.ico" }, // 不是 image/x-icon
			],
		},
	},
});
