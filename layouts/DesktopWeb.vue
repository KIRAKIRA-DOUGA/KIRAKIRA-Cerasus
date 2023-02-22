<script setup lang="ts">
	const showBanner = ref(false);
	watchRoute(() => (showBanner.value = getRoutePath() === ""), true);
</script>

<template>
	<SideBar class="sidebar" />
	<div class="container">
		<Banner :collapsed="!showBanner" />
		<main>
			<slot></slot>
		</main>
	</div>
</template>

<style scoped lang="scss">
	.container {
		padding-left: $sidebar-width;
	}

	main {
		max-width: 1920px;
		margin: 0 auto;
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		transition: background $ease-out-max 250ms;
	}
</style>
