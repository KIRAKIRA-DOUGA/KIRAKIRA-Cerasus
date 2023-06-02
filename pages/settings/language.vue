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
	<div class="chip column">
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
