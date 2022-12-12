<template>
	<NuxtLayout :name="layout">
		<router-view />
	</NuxtLayout>
</template>

<script setup lang="ts">
	import { ref } from "vue";

	// @ts-ignore
	useHead({
		htmlAttrs: {
			lang: "zh-cmn-Hans-CN", // 中文-普通话-简体字-大陆地区
		},
		bodyAttrs: {
			id: "root",
		},
		titleTemplate: "%s - KIRAKIRA☆DOUGA",
		link: [
			{ rel: "icon", type: "image/vnd.microsoft.icon", href: "/favicon.ico" }, // 不是 image/x-icon
			{ rel: "apple-touch-icon", href: "/public/static/touch/logo_x48.png" },
			{ rel: "manifest", href: "/app.webmanifest" },
		],
	});
	Theme.init();

	const layout = ref("desktop-web");
	// const slotName = ref("desktop-web-slot");

	// 下方为测试用，5秒延时后将具名layout和具名插槽的名字赋值为 PE 端

	// setTimeout(() => {
	// 	layout.value = "pocket-edition-web";
	// 	slotName.value = "pocket-edition-web-slot";
	// }, 5000);
</script>

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
