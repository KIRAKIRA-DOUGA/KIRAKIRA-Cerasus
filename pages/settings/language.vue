<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
	const { locale: currentLocale, locales } = useI18n();
	
	const localeModel = computed({
		get: () => currentLocale.value,
		set: value => switchLanguage(value),
	});
	const localeList = computed(() => (locales.value as LocaleObject[]).map(locale => ({
		code: locale.code,
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
			:lang="locale.code"
			:title="t[locale.code]"
		>
			<div class="line">
				{{ locale.name }}
			</div>
		</SettingsGridItem>
	</section>
</template>

<style scoped lang="scss">
	.line {
		width: 100%;
		margin: 20px;
		color: c(icon-color);
		font-weight: 500;
		font-size: 32px;
		line-height: 56px;
		text-align: center;
		border: c(gray-40) solid;
		border-width: 1px 0;
		
		&:lang(en) {
			font-family: $english-logo-fonts;
		}
		
		.settings-grid-item.active & {
			color: c(accent);
			border-color: c(accent-30);
		}
	}
</style>
