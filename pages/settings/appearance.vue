<script setup lang="ts">
	import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
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
</script>

<template>
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
</template>
