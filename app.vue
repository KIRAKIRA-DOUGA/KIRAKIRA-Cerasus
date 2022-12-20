<script setup lang="ts">
	// const colorMode = useColorMode();
	// console.log(colorMode);
	Theme.watchTheme();
	useHead({
		htmlAttrs: {
			lang: "zh-cmn-Hans-CN", // 中文-普通话-简体字-大陆地区
			"data-theme": Theme.theme,
			"data-palette": Theme.palette,
		},
		titleTemplate: "%s - KIRAKIRA☆DOUGA",
		meta: [
			{ "http-equiv": "Content-Type", content: "text/html;charset=UTF-8" },
			{ "http-equiv": "X-UA-Compatible", content: "IE=Edge,chrome=1" },
			{ name: "renderer", content: "webkit" },
			{ name: "theme-color", content: "#f06e8e" },
			{ name: "description", content: "一个可爱的视频网站，献给可爱的你～" },
			{ name: "keywords", content: "视频,弹幕,字幕,音频,歌词,相簿,相册,照片,视频网站,弹幕视频,二次元,动漫,动画,音乐,动漫音乐,音MAD,AMV,MAD,ANIME,ACG,NOVA" },
		],
		link: [
			{ rel: "icon", type: "image/vnd.microsoft.icon", href: "/favicon.ico" },
			{ rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/public/static/touch/48.png" },
			{ rel: "manifest", href: "/app.webmanifest" },
		],
	});

	const layout = ref("desktop-web");
	// const slotName = ref("desktop-web-slot");

	// 下方为测试用，5秒延时后将具名layout和具名插槽的名字赋值为 PE 端

	// setTimeout(() => {
	// 	layout.value = "pocket-edition-web";
	// 	slotName.value = "pocket-edition-web-slot";
	// }, 5000);

	if (process.client)
		window.addEventListener("load", () => {
			if (!("serviceWorker" in navigator))
				throw new Error("serviceWorker is not supported in current browser!");
			navigator.serviceWorker.register("/sw.js");
		});
</script>

<template>
	<NuxtLayout :name="layout">
		<router-view />
	</NuxtLayout>
</template>

<style lang="scss">
	:root {
		/* colors */
		--kirakira-side-bar-background-color: #6cf; // ♬ 66CCFF ♬

		/* css size */
		--full-screen-height: 100vh;
		--full-screen-width: 100vw;

		--kirakira-side-bar-width: 48px; // side bar width
		--kirakira-main-page-banner-height: 140px;

		--zero: 0;
		--zero-pixel: 0;

		/* side bar size */
		--kirakira-main-side-bar-width: 60px;
	}
</style>
