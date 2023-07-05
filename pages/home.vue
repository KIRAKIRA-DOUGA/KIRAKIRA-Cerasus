<script setup lang="ts">
	import testVideo from "assets/images/cav5-cover.png";
	import testVideo2 from "assets/images/av820864307.jpg";
	import testAudio from "assets/images/av893640047.jpg";

	const selectedTab = ref("home");

	useHead({ title: "首页" });

	const pages = getPages(
		["组件测试页", "/components"],
		["富文本测试页", "/test-rich-text-editor"],
		["API 测试页", "/test-api"],
		["动态图标测试页", "/test-lottie"],
		["搜索", "/search"],
		["投稿", "/upload"],
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
		<TabBar v-model="selectedTab" class="category-tab">
			<TabItem id="home" direction="vertical" icon="home">{{ t.home }}</TabItem>
			<TabItem id="music" direction="vertical-reverse" :badge="233">{{ t.music }}</TabItem>
			<TabItem id="anime" direction="vertical-reverse" :badge="233">{{ t.anime }}</TabItem>
			<TabItem id="otomad" direction="vertical-reverse" :badge="233">{{ t.otomad }}</TabItem>
			<TabItem id="tech" direction="vertical-reverse" :badge="233">{{ t.technology }}</TabItem>
			<TabItem id="game" direction="vertical-reverse" :badge="233">{{ t.game }}</TabItem>
			<TabItem id="synth" direction="vertical-reverse" :badge="233">{{ t.synthetical }}</TabItem>
		</TabBar>
		<Subheader icon="category" :badge="233">分区</Subheader>
		<div class="videos">
			<ThumbVideo
				link="video"
				uploader="艾了个拉"
				:image="testVideo"
				:date="new Date()"
				:watchedCount="233_0000"
				:duration="new Duration(2, 33)"
			>测试视频</ThumbVideo>
			<ThumbVideo
				blank
				link="video"
				uploader="艾了个拉"
				:image="testVideo2"
				:date="new Date()"
				:watchedCount="233_0000"
				:duration="new Duration(2, 33)"
			>在新窗口打开视频</ThumbVideo>
			<ThumbVideo
				link="audio"
				uploader="艾了个拉"
				:image="testAudio"
				:date="new Date()"
				:watchedCount="233_0000"
				:duration="new Duration(2, 33)"
			>测试音频</ThumbVideo>
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

<style scoped lang="scss">
	.container {
		padding-top: 0 !important;

		> * {
			margin: 26px 0;
		}
	}

	.tab-bar {
		--loose: true;
	}

	.category-tab {
		.items {
			gap: 2rem;

			> * {
				font-weight: 500;
			}
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
			@include round-small;
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
		gap: 4px;
		margin: 0 -8px;
	}
</style>
