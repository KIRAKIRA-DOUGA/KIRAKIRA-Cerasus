<script setup lang="ts">
	import "css-doodle";

	const { locale } = useI18n();
	const langTag = computed(() => {
		const langs = {
			zh: "zh-cmn-Hans-CN", // 中文-普通话-简体字-大陆地区
			en: "en-eng-Latn-US",
			ja: "ja-jpn-Jpan-JP",
		};
		return langs[locale.value as keyof typeof langs] ?? locale.value;
	});
	useHead({
		htmlAttrs: {
			lang: langTag,
		},
		titleTemplate: "%s - KIRAKIRA☆DOUGA",
		meta: [
			{ "http-equiv": "Content-Type", content: "text/html;charset=UTF-8" },
			{ "http-equiv": "X-UA-Compatible", content: "IE=Edge,chrome=1" },
			{ name: "renderer", content: "webkit" },
			{ name: "theme-color", content: Theme.meta },
			{ name: "description", content: "一个可爱的视频网站，献给可爱的你～" },
			{ name: "keywords", content: "视频,弹幕,字幕,音频,歌词,相簿,相册,照片,视频网站,弹幕视频,二次元,动漫,动画,音乐,动漫音乐,音MAD,AMV,MAD,ANIME,ACG,NOVA" },
			// 以下内容为苹果私有属性。
			{ name: "apple-mobile-web-app-title", content: "KIRAKIRA☆DOUGA" }, // 添加到主屏后的标题 (iOS)
			{ name: "apple-mobile-web-app-capable", content: "yes" }, // 启用 WebApp 全屏模式 (iOS)
			{ name: "apple-touch-fullscreen", content: "yes" }, // 启用 WebApp 全屏模式 (iOS)
			{ "http-equiv": "Cache-Control", content: "no-siteapp" }, // 百度禁止转码。通过百度手机打开网页时，百度可能会对你的网页进行转码，往你页面贴上它的广告，非常之恶心。
			{ name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }, // 设置状态栏的背景颜色 (iOS)
			{ name: "format-detection", content: "telephone=no" }, // 停用手机号码识别 (iOS)
			{ name: "format-detection", content: "email=no" }, // 停用邮箱识别 (Android)
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

	const pageTransition = ref<"page-forward" | "page-backward" | "page-jump">("page-forward");

	watchRoute((route, prevRoute) => {
		[route, prevRoute] = [removeI18nPrefix(route), removeI18nPrefix(prevRoute)];
		pageTransition.value = "page-jump";
		if (prevRoute.includes(route)) pageTransition.value = "page-backward";
		if (route.includes(prevRoute)) pageTransition.value = "page-forward";
	});
</script>

<template>
	<NuxtLayout :name="layout">
		<RouterView v-slot="{ Component }">
			<Transition :name="pageTransition" mode="out-in">
				<component :is="Component" />
			</Transition>
		</RouterView>
	</NuxtLayout>
	<Toasts />
</template>
