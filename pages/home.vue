<script setup lang="ts">
	import testVideo from "assets/images/av820864307.jpg";
	import testAudio from "assets/images/av893640047.jpg";

	const selectedTab = ref("home");

	useHead({ title: "首页" });

	const pages = getPages(
		["组件测试页", "components"],
		["搜索", "search"],
		["内容", "/hello"],
		["下一页", "/next"],
	);

	const httpCodes = getPages(
		233,
		404,
		500,
		502,
		503,
		601,
	);

	type Page = { name: string; link: string };

	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(...pages: [string, string][]): Page[];
	/**
	 * 获取页面列表。
	 * @param httpCodes - HTTP 代码数组。
	 * @returns 页面对象。
	 */
	function getPages(...httpCodes: number[]): Page[];
	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(...pages: ([string, string] | number)[]): Page[] {
		return pages.map(page => (typeof page === "number" ? { name: String(page), link: String(page) } :
			{ name: page[0], link: page[1] }) as Page);
	}
</script>

<template>
	<div class="container">
		<TabBar v-model="selectedTab" class="tabbar">
			<TabItem id="home">{{ t.home }}</TabItem>
			<TabItem id="anime">{{ t.anime }}</TabItem>
			<TabItem id="music">{{ t.music }}</TabItem>
			<TabItem id="otomad">{{ t.otomad }}</TabItem>
		</TabBar>
		<Subheader icon="apps" :badge="233">搞笑</Subheader>
		<div class="videos">
			<ThumbVideo link="video" :image="testVideo" :date="new Date()" :watchedCount="233_0000">测试视频</ThumbVideo>
			<ThumbVideo link="audio" :image="testAudio" :date="new Date()" :watchedCount="233_0000">测试音频</ThumbVideo>
		</div>
		<Subheader icon="home" :badge="233">网站地图</Subheader>
		<div class="pages">
			<LocaleLink v-for="page in pages" :key="page.name" class="link lite" :to="page.link">{{ page.name }}</LocaleLink>
		</div>
		<Subheader icon="error" :badge="233">错误页</Subheader>
		<div class="pages">
			<a v-for="page in httpCodes" :key="page.name" class="link lite" :href="page.link">{{ page.name }}</a>
		</div>
	</div>
</template>

<i18n lang="json5">
{
	zh: {
		home: "首页",
		anime: "动画",
		music: "音乐",
		otomad: "音MAD",
	},
	en: {
		home: "Home",
		anime: "Anime",
		music: "Music",
		otomad: "Otomad",
	},
	ja: {
		home: "ホーム",
		anime: "アニメ",
		music: "音楽",
		otomad: "音MAD",
	},
}
</i18n>

<style scoped lang="scss">
	.container {
		padding-top: 0 !important;

		> * {
			margin: 26px 0;
		}
	}

	%tabulation {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.pages {
		@extend %tabulation;

		.link {
			@include radius-small;
			padding: 7px 16px;
			background-color: c(accent-10);

			&:hover {
				opacity: 0.75;
			}

			&:focus {
				@include button-shadow-focus;
			}

			.dark & {
				color: c(icon-color);
			}
		}
	}

	.videos {
		@extend %tabulation;
		gap: 14px;
		margin: 0 -8px;
	}
</style>
