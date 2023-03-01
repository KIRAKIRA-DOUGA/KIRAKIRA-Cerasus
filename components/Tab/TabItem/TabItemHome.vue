<script setup lang="ts">
	const props = withDefaults(defineProps<{
		id: string;
	}>(), {
		id: "home",
	});
</script>

<template>
	<TabItem :id="id" vertical>
		<NuxtIcon name="home" :style="{ fontSize: '18px' }" />
		<slot>{{ t.home }}</slot>
	</TabItem>
</template>

<i18n lang="json5">
{
	zh: {
		home: "首页",
	},
	en: {
		home: "Home",
	},
	ja: {
		home: "ホーム",
	},
}
</i18n>
