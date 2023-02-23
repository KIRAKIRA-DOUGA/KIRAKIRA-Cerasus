<script setup lang="ts">
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
		padding: 0 100px;

		@media #{$tablet} {
			padding: 0 40px;
		}

		> * {
			margin: 26px 0;
		}
	}

	.pages {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

		.link {
			@include radius-small;
			padding: 7px 16px;
			background-color: c(accent-10);

			&:hover {
				opacity: 0.75;
			}
		}
	}
</style>
