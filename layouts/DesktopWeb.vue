<script setup lang="ts">
	const showBanner = ref(false);
	watchRoute(() => (showBanner.value = getRoutePath() === ""), true);
</script>

<template>
	<SideBar class="sidebar" />
	<div class="container">
		<Banner :collapsed="!showBanner" />
		<div class="page">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		padding-left: $sidebar-width;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		transition: none;
	}
</style>
