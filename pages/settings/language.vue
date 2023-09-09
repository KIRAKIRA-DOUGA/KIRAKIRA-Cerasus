<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	const { locale: currentLocale, locales } = useI18n();

	const localeModel = computed({
		get: () => currentLocale.value,
		set: value => switchLanguage(value),
	});
	const localeList = computed(() => (locales.value as LocaleObject[]).map(locale => ({
		code: locale.code,
		lang: locale.code === "zhs" ? "zh-Hans-CN" : locale.code === "zht" ? "zh-Hant-TW" : locale.code,
		name: locale.name || locale.code,
	})));
</script>

<template>
	<section grid>
		<SettingsGridItem
			v-for="locale in localeList"
			:id="locale.code"
			:key="locale.code"
			v-model="localeModel"
			:title="t.language[locale.code]"
		>
			<div class="line" :lang="locale.lang">
				{{ locale.name }}
			</div>
		</SettingsGridItem>
	</section>
</template>

<style scoped lang="scss">
	.line {
		width: 100%;
		margin: 0 20px;
		padding: 20px 0;
		color: c(icon-color);
		font-weight: 500;
		font-size: 32px;
		line-height: 32px;
		text-align: center;
		border: c(gray-40) solid;
		border-width: 1px 0;
		font-feature-settings: normal;

		&:lang(en),
		&:lang(vi),
		&:lang(id) {
			font-family: $english-logo-fonts;
		}

		.settings-grid-item.active & {
			color: c(accent);
			border-color: c(accent-30);
		}

		@container style(--column: single) {
			margin: 0 12px;
			padding: 12px 0;
			font-size: 20px;
			line-height: 20px;
		}
	}
</style>
