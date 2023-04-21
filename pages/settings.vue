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

	const themeList = ["light", "dark", "system"] as const;
	const paletteList = ["pink", "sky", "blue", "orange", "purple", "green"] as const;

	useHead({ title: t.settings });
</script>

<template>
	<div class="settings">
		<nav>
			<div class="title">
				<h2>{{ t.settings }}</h2>
			</div>
			<div class="nav-items">
				<TextBox v-model="search" placeholder="搜索设置" />
				<Button href="/components">组件测试页</Button>
			</div>
		</nav>
		<main>
			<div class="card"></div>
			<div class="content">
				<h2>外观</h2>
				<Subheader icon="brightness_medium">主题</Subheader>
				<div class="chip radio-group">
					<RadioButton v-for="item in themeList" :key="item" v-model="theme" v-ripple :value="item">{{ t[item] }}</RadioButton>
				</div>
				<Subheader icon="palette">个性色</Subheader>
				<div class="chip radio-group">
					<RadioButton v-for="item in paletteList" :key="item" v-model="palette" v-ripple :value="item">{{ t[item] }}</RadioButton>
				</div>
				<Subheader icon="translate">语言</Subheader>
				<div class="chip radio-group">
					<RadioButton
						v-for="locale in localeList"
						:key="locale.code"
						v-model="localeModel"
						v-ripple
						:value="locale.code"
						:lang="locale.code"
					>{{ locale.name }}</RadioButton>
				</div>
			</div>
		</main>
	</div>
</template>

<i18n lang="json5">
{
	zh: {
		settings: "设置",
		light: "浅色主题",
		dark: "深色主题",
		system: "跟随系统",
		pink: "萌妹粉",
		sky: "天空蓝",
		blue: "智乃蓝",
		green: "千夜绿",
		orange: "心爱橙",
		purple: "理世紫",
	},
	en: {
		settings: "Settings",
		light: "Light theme",
		dark: "Dark theme",
		system: "Follow system theme",
		pink: "Kawaii Pink",
		sky: "Sky Blue",
		blue: "Chino Blue",
		green: "Chiya Green",
		orange: "Cocoa Orange",
		purple: "Rize Purple",
	},
	ja: {
		settings: "設定",
		light: "ライトテーマ",
		dark: "ダークテーマ",
		system: "システムのテーマ設定を使用する",
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

	.settings {
		display: flex;
		justify-content: center;
		min-height: 100dvh;
		background-color: c(gray-20);
	}

	nav {
		@include flex-block;
		position: sticky;
		top: 0;
		flex-shrink: 0;
		gap: 10px;
		width: 245px;
		height: 100%;
		margin-right: $center-gap;
		margin-left: $center-gap;
		padding-top: $page-top-gap;

		@include tablet {
			display: none;
		}
	}

	.nav-items {
		@include flex-block;
		gap: 10px;
	}

	main {
		position: relative;
		width: 100%;
		max-width: 960px;

		> .card {
			@include card-shadow;
			position: absolute;
			width: 100dvw;
			height: 100%;
			background-color: c(main-bg);
		}

		> .content {
			@include flex-block;
			position: relative;
			z-index: 1;
			gap: 1rem;
			padding: $page-top-gap 48px;
		}
	}

	h2 {
		color: c(accent);
	}

	.chip {
		@include chip-shadow;
		@include radius-large;
	}

	.radio-group {
		overflow: hidden;

		.radio-button {
			$extra-padding: 16px;
			padding: 10px 20px;

			&:first-child {
				padding-top: $extra-padding;
			}

			&:last-child {
				padding-bottom: $extra-padding;
			}
		}
	}
</style>
