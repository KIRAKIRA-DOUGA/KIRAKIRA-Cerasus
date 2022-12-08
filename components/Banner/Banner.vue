<script setup lang="ts">
	const props = withDefaults(defineProps<{
		collapsed?: boolean;
	}>(), {
		collapsed: false,
	});

	watchRoute((nowRoute, oldRoute) => console.log("route watch: ", nowRoute, oldRoute));

	function getRoute() {
		console.log("getRouter: ", getRoutePath());
	}
</script>

<template>
	<div class="kirakira-main-page-banner-box kirakira-main-page-banner-box-opened" :class="{ collapsed }" @click="getRoute">
		hello, banner
	</div>
</template>

<style scoped lang="scss">

	.kirakira-main-page-banner-box {
		// please romove when deploy 下方CSS请在部署前移除
		background-color: #0080001a;

		overflow: hidden;
		width: 100%;
	}
	.kirakira-main-page-banner-box-opened {
		height: var(--kirakira-main-page-banner-height);

		&.collapsed {
			height: 0;
		}
	}

	.kirakira-main-page-banner-box-closed {
		height: var(--zero);
	}
</style>
