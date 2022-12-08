<script setup lang="ts">
	const props = withDefaults(defineProps<{
		collapsed?: boolean;
	}>(), {
		collapsed: false,
	});
</script>

<template>
	<div class="kirakira-main-page-banner-box" :class="{ collapsed }">
		hello, banner
	</div>
</template>

<style scoped lang="scss">
	.kirakira-main-page-banner-box {
		// please romove when deploy 下方CSS请在部署前移除
		background-color: #0080001a;

		overflow: hidden;
		width: 100%;
		height: var(--kirakira-main-page-banner-height);

		&.collapsed {
			height: 0;
		}
	}
</style>
