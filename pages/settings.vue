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
	const main = ref<HTMLElement>();
	const showDrawer = ref(false);

	useEventListener("window", "resize", () => {
		if (window.innerWidth > 991) showDrawer.value = false;
	});

	useHead({ title: t.settings });
</script>

<template>
	<div v-bind="$attrs" class="settings">
		<ShadingIcon icon="settings" position="right top" rotating elastic />

		<nav :class="{ show: showDrawer }">
			<div class="content">
				<header class="title content padding-end">
					<header class="title nav-header">
						<h1>{{ t.settings }}</h1>
						<TextBox v-model="search" :placeholder="t.searchSettings" />
					</header>
					<Subheader icon="person">用户设置</Subheader>
					<Subheader icon="apps">应用设置</Subheader>
					<div class="nav-items">
						<Button href="/components">组件测试页</Button>
					</div>
				</header>
			</div>
		</nav>

		<div class="card"></div>
		<main ref="main">
			<div class="content padding-end">
				<header class="title page-header">
					<div class="show-drawer-wrapper">
						<LargeRippleButton icon="dehaze" @click="showDrawer = true" />
					</div>
					<h2>{{ t.appearance }}</h2>
				</header>
				<Subheader icon="brightness_medium">{{ t.theme }}</Subheader>
				<div class="chip radio-group">
					<RadioButton
						v-for="item in themeList"
						:key="item"
						v-model="theme"
						v-ripple
						:value="item"
					>{{ t[item] }}</RadioButton>
				</div>
				<Subheader icon="palette">{{ t.palette }}</Subheader>
				<div class="chip radio-group">
					<RadioButton
						v-for="item in paletteList"
						:key="item"
						v-model="palette"
						v-ripple
						:value="item"
					>{{ t[item] }}</RadioButton>
				</div>
				<Subheader icon="translate">{{ t.language }}</Subheader>
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

		<Transition>
			<div v-if="showDrawer" class="mask" @click="showDrawer = false"></div>
		</Transition>
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
		searchSettings: "搜索设置",
		appearance: "外观",
		theme: "主题",
		palette: "个性色",
		language: "语言",
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
		searchSettings: "Search settings",
		appearance: "Appearance",
		theme: "Theme",
		palette: "Palette",
		language: "Language",
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
		searchSettings: "検索設定",
		appearance: "外観",
		theme: "テーマ",
		palette: "個性の色",
		language: "言語",
	},
}
</i18n>

<style scoped lang="scss">
	$title-padding-top: 26px;
	$nav-padding-x: 24px;
	$main-padding-x: 48px;
	$show-drawer-duration: 500ms;
	$nav-width: 245px + 2 * $nav-padding-x;
	$max-width: 960px;

	.settings {
		--side-width: calc(max((100% - #{$max-width + $nav-width}) / 2, 0px)); // 注意这里的 0px 一旦省略 px 就会报错，因此不能去掉单位。
		position: relative;
		min-height: 100dvh;
		background-color: c(gray-20);
	}

	nav {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		width: $nav-width;
		height: 100%;
		margin-left: var(--side-width);

		@include tablet {
			@include system-card;
			background-color: c(acrylic-bg, 75%);
			transition-duration: $show-drawer-duration;

			&:not(.show) {
				translate: -$nav-width - 16px;
			}
		}

		@include computer {
			display: block !important;
		}

		> .content > .title.content {
			@include flex-block;
			gap: 10px;
			max-height: 100dvh;
			padding: 0 $nav-padding-x;
			overflow-y: overlay;

			> * {
				flex-shrink: 0;
			}
		}
	}

	.nav-items {
		@include flex-block;
		gap: 10px;
	}

	:is(nav, main) > .content {
		height: 100%;

		> * {
			flex-shrink: 0;
		}
	}

	.card {
		@include card-shadow;
		@include square(100%);
		position: absolute;
		z-index: 5;
		pointer-events: none;
	}

	.card,
	main {
		--margin-left: calc(var(--side-width) + #{$nav-width});

		@include computer {
			margin-left: var(--margin-left);

			> .content {
				width: calc(100% - var(--margin-left));
			}
		}
	}

	main {
		position: relative;
		z-index: 2;
		width: 100%;
		min-height: 100dvh;
		background-color: c(main-bg);
		transition: $fallback-transitions, width 0s, height 0s;

		> .content {
			@include flex-block;
			position: relative;
			z-index: 1;
			gap: 1rem;
			max-width: $max-width;
			padding: 0 $main-padding-x;
		}
	}

	.padding-end::after {
		display: block;
		opacity: 0;
		content: ".";
	}

	h1,
	h2 {
		color: c(accent);
		font-weight: bold;
		font-size: calc(1.275rem + 0.3dvw);
	}

	.title {
		position: sticky;
		top: 0;
		z-index: 2;
		padding-top: $title-padding-top;
		backdrop-filter: blur(4px);
	}

	.nav-header {
		margin-right: #{-$nav-padding-x};
		margin-bottom: -10px;
		margin-left: #{-$nav-padding-x};
		padding-right: $nav-padding-x;
		padding-bottom: 10px;
		padding-left: $nav-padding-x;
		background-color: c(gray-20, 80%);

		h1 {
			margin-bottom: 10px;
		}
	}

	.page-header {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		margin-right: #{-$main-padding-x};
		margin-bottom: -0.5rem;
		margin-left: #{-$main-padding-x};
		padding-right: $main-padding-x;
		padding-bottom: 0.5rem;
		padding-left: $main-padding-x;
		background-color: c(main-bg, 80%);

		.show-drawer-wrapper {
			position: relative;
			width: 20px;
			height: 100%;

			.large-ripple-button {
				position: absolute;
				top: calc((var(--wrapper-size) - 100%) / -2);
				left: -10px;
			}

			@include computer {
				display: none;
			}
		}
	}

	.mask {
		@include full-screen(absolute);
		z-index: 4;
		background-color: c(main-bg, 50%);
		transition-duration: $show-drawer-duration;

		&.v-enter-from,
		&.v-leave-to {
			opacity: 0;
		}

		&.v-leave-active {
			pointer-events: none;
		}

		@include computer {
			display: none;
		}
	}

	.chip {
		@include chip-shadow;
		@include radius-large;
		overflow: hidden;
	}

	.radio-group .radio-button {
		$extra-padding: 16px;
		padding: 10px 20px;

		&:first-child {
			padding-top: $extra-padding;
		}

		&:last-child {
			padding-bottom: $extra-padding;
		}
	}
</style>
