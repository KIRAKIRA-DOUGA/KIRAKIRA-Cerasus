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
		position: relative;
		width: 100%;
		overflow: hidden;

		// please romove when deploy 下方CSS请在部署前移除
		background-color: #0080001a; // TODO: 魔色待修改。
	}

	.kirakira-main-page-banner-box-opened {
		height: var(--kirakira-main-page-banner-height);
		transition: height $ease-out-expo 600ms;

		> .shadow {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(transparent 0%, transparent 95%, c(black, 33%) 100%);
			opacity: 0.1;
		}

		&.collapsed {
			height: 0;

			> .shadow {
				background: linear-gradient(c(black, 33%) 80%, c(black, 80%));
				opacity: 1;
			}
		}
	}

	.kirakira-main-page-banner-box-closed {
		height: var(--zero);
	}
</style>
