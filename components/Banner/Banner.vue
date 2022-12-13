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
		<div class="shadow"></div>
	</div>
</template>

<style scoped lang="scss">
	.kirakira-main-page-banner-box {
		// please romove when deploy 下方CSS请在部署前移除
		background-color: #0080001a; // TODO: 魔色待修改。

		position: relative;
		overflow: hidden;
		width: 100%;
	}

	.kirakira-main-page-banner-box-opened {
		height: var(--kirakira-main-page-banner-height);
		transition: height $ease-out-expo 600ms;

		> .shadow {
			position: absolute;
			width: 100%;
			height: 100%;
			bottom: 0;
			background: linear-gradient(transparent 0%, transparent 95%, #0005 100%);
			opacity: 0.1;
		}

		&.collapsed {
			height: 0;

			> .shadow {
				background: linear-gradient(#0005 80%, #000c); // TODO: 魔色待修改。
				opacity: 1;
			}
		}
	}

	.kirakira-main-page-banner-box-closed {
		height: var(--zero);
	}
</style>
