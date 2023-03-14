<script setup lang="ts">
	const props = withDefaults(defineProps<{
		id?: string;
	}>(), {
		id: "home",
	});
</script>

<template>
	<TabItem :id="id" vertical>
		<div class="home-icon">
			<NuxtIcon name="home" :style="{ fontSize: '22px', color: 'var(--accent)' }" class="icon" />
		</div>
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

<style scoped lang="scss">
	.home-icon {
		height: 18px;

		.icon {
			margin-top: -2px;
		}
	}
</style>
