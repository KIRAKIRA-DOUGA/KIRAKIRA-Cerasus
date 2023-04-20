<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	const search = ref("");
	const theme = Theme.theme;
	const palette = Theme.palette;
	const { locale: currentLocale, locales } = useI18n();
	const localeModel = computed({
		get: () => currentLocale.value,
		set: value => switchLanguage(value),
	});
	const localeList = computed(() => (locales.value as LocaleObject[]).map(locale => ({
		code: locale.code,
		name: locale.name || locale.code,
	})));
	useHead({ title: t.settings });
</script>

<template>
	<div class="settings-page">
		<div class="menu">
			<div class="title">
				<Header>{{ t.settings }}</Header>
			</div>
			<div class="menu-content">
				<TextBox v-model="search" placeholder="搜索设置" />
				<Button href="/components">组件测试页</Button>
			</div>
		</div>
		<div class="content">
			<h2>外观</h2>
			<h3>主题</h3>
			<div class="chip-radio-group">
				<RadioButton v-model="theme" value="light">{{ t.lightTheme }}</RadioButton>
				<RadioButton v-model="theme" value="dark">{{ t.darkTheme }}</RadioButton>
				<RadioButton v-model="theme" value="system">{{ t.systemTheme }}</RadioButton>
			</div>
			<h3>强调色</h3>
			<div class="chip-radio-group">
				<RadioButton v-model="palette" value="pink">{{ t.pink }}</RadioButton>
				<RadioButton v-model="palette" value="sky">{{ t.sky }}</RadioButton>
				<RadioButton v-model="palette" value="blue">{{ t.blue }}</RadioButton>
				<RadioButton v-model="palette" value="orange">{{ t.orange }}</RadioButton>
				<RadioButton v-model="palette" value="purple">{{ t.purple }}</RadioButton>
				<RadioButton v-model="palette" value="green">{{ t.green }}</RadioButton>
			</div>
			<h2>语言</h2>
			<div class="chip-radio-group">
				<RadioButton v-for="locale in localeList" :key="locale.code" v-model="localeModel" :value="locale.code" :lang="locale.code">{{ locale.name }}</RadioButton>
			</div>
		</div>
	</div>
</template>

<i18n lang="json5">
{
	zh: {
		settings: "设置",
		lightTheme: "浅色主题",
		darkTheme: "深色主题",
		systemTheme: "跟随系统",
		pink: "萌妹粉",
		sky: "天空蓝",
		blue: "智乃蓝",
		green: "千夜绿",
		orange: "心爱橙",
		purple: "理世紫",
	},
	en: {
		settings: "Settings",
		lightTheme: "Light theme",
		darkTheme: "Dark theme",
		systemTheme: "Follow system theme",
		pink: "Kawaii Pink",
		sky: "Sky Blue",
		blue: "Chino Blue",
		green: "Chiya Green",
		orange: "Cocoa Orange",
		purple: "Rize Purple",
	},
	ja: {
		settings: "設定",
		lightTheme: "ライトテーマ",
		darkTheme: "ダークテーマ",
		systemTheme: "システムのテーマ設定を使用する",
		pink: "カワイイ ピンク",
		sky: "空色",
		blue: "チノ 青",
		green: "千夜 緑",
		orange: "ココア オレンジ",
		purple: "リゼ 紫",
	},
}
</i18n>

<style scoped lang="scss">
	$page-top-gap: 26px;
	$center-gap: 24px;

	.title {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		align-items: flex-end;
	}

	.settings-page {
		display: flex;
		justify-content: center;
		min-height: 100vh;
		background-color: c(gray-20);
	}

	.menu {
		@include flex-block;
		position: sticky;
		top: 0;
		gap: 10px;
		width: 245px;
		height: 100%;
		margin-right: $center-gap;
		padding-top: $page-top-gap;
	}

	.menu-content {
		@include flex-block;
		gap: 10px;
	}

	.content {
		@include card-shadow;
		@include flex-block;
		gap: 1rem;
		width: 100%;
		max-width: 960px;
		padding: $page-top-gap 48px;
		background-color: c(main-bg);
	}

	h2,
	h3 {
		color: c(accent);
	}

	.chip-radio-group {
		@include chip-shadow;
		@include radius-large;

		.radio-button {
			padding: 14px 20px;
		}
	}
</style>
