<script setup lang="ts">
	import crowdinLogoSvg from "assets/svg/crowdin.svg";
	import { useDynamicLayout } from "helpers/page-transition";
	import manifest from "public/manifest.json";

	const homepage = "https://kirakira.moe/";
	const { locale } = useI18n();
	const inContextLocalization = isInContextLocalization();

	const langTag = computed(() => ({
		zhs: "zh-Hans-CN",
		zht: "zh-Hant-TW",
	} as RecordValue<string>)[locale.value] ?? (inContextLocalization.value && globalThis.jipt ? globalThis.jipt.target_language : locale.value));

	useHead({
		htmlAttrs: {
			lang: langTag,
		},
		titleTemplate: titleChunk => {
			return titleChunk ? `${titleChunk} - KIRAKIRA☆DOUGA` : "KIRAKIRA☆DOUGA";
		},
		meta: [
			{ "http-equiv": "Content-Type", content: "text/html;charset=UTF-8" },
			{ "http-equiv": "X-UA-Compatible", content: "IE=Edge,chrome=1" },
			{ name: "viewport", content: "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" },
			{ name: "renderer", content: "webkit" },
			{ name: "description", content: manifest.description },
			{ name: "keywords", content: "视频,弹幕,字幕,音频,歌词,相簿,相册,照片,视频网站,弹幕视频,二次元,动漫,动画,音乐,动漫音乐,音MAD,AMV,MAD,ANIME,ACG,NOVA" },
			// 以下内容为各种苹果私有属性。
			{ name: "apple-mobile-web-app-title", content: "KIRAKIRA" }, // 添加到主屏后的标题 (iOS)
			{ name: "apple-mobile-web-app-capable", content: "yes" }, // 启用 WebApp 全屏模式 (iOS)
			{ name: "apple-touch-fullscreen", content: "yes" }, // 启用 WebApp 全屏模式 (iOS)
			{ name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }, // 设置状态栏的背景颜色 (iOS)
			{ name: "format-detection", content: "telephone=no" }, // 停用手机号码识别 (iOS)
			{ name: "format-detection", content: "email=no" }, // 停用邮箱识别 (Android)
			// 以下内容为各种百度私有属性。
			{ "http-equiv": "Cache-Control", content: "no-siteapp" }, // 百度禁止转码。通过百度手机打开网页时，百度可能会对你的网页进行转码，往你页面贴上它的广告，非常之恶心。
			{ name: "referrer", content: "no-referrer" }, // 反防盗链
			// 以下内容为开放图谱协议 (Open Graph Protocol) 属性。
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: manifest.name },
			{ property: "og:title", content: manifest.name }, // 这里得放页面的 title。
			{ property: "og:description", content: manifest.description },
			{ property: "og:image", content: `${homepage}static/images/thumbnail.png` },
			{ property: "og:url", content: homepage },
			// 以下内容为推特私有内容属性。
			{ name: "twitter:card", content: "summary" },
			{ name: "twitter:site", content: manifest.name },
			{ name: "twitter:title", content: manifest.name }, // 这里得放页面的 title。
			{ name: "twitter:description", content: manifest.description },
			{ name: "twitter:image", content: `${homepage}static/images/thumbnail.png` },
			{ name: "twitter:url", content: homepage },
		],
		link: [
			{ rel: "icon", type: "image/vnd.microsoft.icon", href: "/favicon.ico" },
			{ rel: "apple-touch-icon", href: "/public/static/images/touch/48.png" },
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "alternate", href: homepage, hreflang: "x-default" },
			{ rel: "alternate", href: homepage, hreflang: "zh-Hans" },
			{ rel: "alternate", href: homepage, hreflang: "zh-CN" },
			{ rel: "alternate", href: homepage, hreflang: "zh-SG" },
			{ rel: "alternate", href: homepage, hreflang: "zh-MY" },
			{ rel: "alternate", href: `${homepage}zht`, hreflang: "zh-Hant" },
			{ rel: "alternate", href: `${homepage}zht`, hreflang: "zh-TW" },
			{ rel: "alternate", href: `${homepage}zht`, hreflang: "zh-HK" },
			{ rel: "alternate", href: `${homepage}zht`, hreflang: "zh-MO" },
			{ rel: "alternate", href: `${homepage}en`, hreflang: "en" },
			{ rel: "alternate", href: `${homepage}ja`, hreflang: "ja" },
			{ rel: "alternate", href: `${homepage}ko`, hreflang: "ko" },
			{ rel: "alternate", href: `${homepage}vi`, hreflang: "vi" },
			{ rel: "alternate", href: `${homepage}id`, hreflang: "id" },
			{ rel: "alternate", href: `${homepage}fr`, hreflang: "fr" },
			{ rel: "alternate", href: `${homepage}yue`, hreflang: "zh-yue" },
			{ rel: "alternate", href: `${homepage}yue`, hreflang: "yue" },
			{ rel: "preconnect", href: "https://rsms.me/" },
			{ rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
		],
		script: inContextLocalization.value ? [
			{
				innerHTML: `(${() => {
					globalThis._jipt = Object.entries({
						project: "kirakira",
						escape() {
							globalThis.location.pathname = "/settings/language";
						},
					});
				}})()`,
			},
			{ src: "https://cdn.crowdin.com/jipt/jipt.js", tagPriority: "low" },
		] : undefined,
	});

	watch(inContextLocalization, enableJipt => {
		if (enableJipt && !globalThis.jipt) {
			const jiptLoaderLogo = document.createElement("img");
			jiptLoaderLogo.className = "jipt-loader-logo";
			jiptLoaderLogo.src = crowdinLogoSvg;
			document.body.append(jiptLoaderLogo);
			document.getElementById("root")!.hidden = true;
			setTimeout(() => location.reload(), 250);
		} else if (globalThis.jipt)
			globalThis.jipt[enableJipt ? "start" : "stop"]();
	});

	const layout = useDynamicLayout();

	const backgroundImages = useBackgroundImages();
	watch(() => backgroundImages.currentDominantColor, color => {
		document.documentElement.style.setProperty("--accent-wallpaper", color || null);
	});

	// Service Worker
	if (environment.client)
		window.addEventListener("load", () => {
			if (!("serviceWorker" in navigator))
				throw new Error("serviceWorker is not supported in current browser!");
			navigator.serviceWorker.register("/sw.js");
		});

	// 开发环境测试用全局变量
	loadDevGlobal();
	// 彩蛋
	loadEgg();
	if (environment.client)
		console.log(
			"\n%cKIRAKIRA☆DOUGA%c\nA cute site for cute people! # KAWAII FOREVER #\n",
			"font-size: 24px; font-weight: bold; color: #f06e8e;",
			"color: #f06e8e;",
		);
</script>

<template>
	<NuxtLayout :name="layout">
		<NuxtPage />
	</NuxtLayout>

	<Toasts />
	<Tooltips />

	<PageLoadingIndicator />
	<div id="large-viewport-size"></div>
</template>
