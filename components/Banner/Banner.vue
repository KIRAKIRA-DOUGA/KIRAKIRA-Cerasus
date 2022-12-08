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
		<div class="shadow"></div>
	</div>
</template>

<style scoped lang="scss">
	.kirakira-main-page-banner-box {
		// please romove when deploy 下方CSS请在部署前移除
		background-color: #0080001a;

		position: relative;
		overflow: hidden;
		width: 100%;
		height: var(--kirakira-main-page-banner-height);

		> .shadow {
			position: absolute;
			width: 100%;
			height: 100%;
			bottom: 0;
			background: linear-gradient(#0005 80%, #000a);
			opacity: 0;
		}

		&.collapsed {
			height: 0;

			> .shadow {
				opacity: 1;
			}
		}
	}
</style>
