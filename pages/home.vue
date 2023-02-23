<script setup lang="ts">
	const selectedTab = ref("home");

	useHead({ title: "首页" });

	/**
	 * 获取页面列表。
	 * @param pages - 页面数组。
	 * @returns 页面对象。
	 */
	function getPages(pages: [string, string][]) {
		const result = {} as Record<string, string>;
		return pages.forEach(page => result[page[0]] = page[1]);
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
			<LocaleLink class="link lite" to="components">组件测试页</LocaleLink>
			<LocaleLink class="link lite" to="search">搜索</LocaleLink>
			<LocaleLink class="link lite" to="/hello">内容</LocaleLink>
			<LocaleLink class="link lite" to="/next">下一页</LocaleLink>
		</div>
		<Subheader icon="error" :badge="233">错误页</Subheader>
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
