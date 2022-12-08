<script setup lang="ts">
	const props = withDefaults(defineProps<{
		collapsed?: boolean;
	}>(), {
		collapsed: false,
	});

	const getRoute = () => {
		console.log("useRoute", route);
	};

	const route = useRoute();
	// const routePath = ref(route.path);
	watch(
		route,
		(oldRoute, newRoute) => console.log("route: ", oldRoute, newRoute),
	);
</script>

<template>
	<div class="kirakira-main-page-banner-box kirakira-main-page-banner-box-opened" :class="{ collapsed }" @click="{ getRoute }">
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
