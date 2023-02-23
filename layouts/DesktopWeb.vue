<script setup lang="ts">
	import background from "assets/styles/css-doodles/background.css-doodle";

	const showBanner = ref(false);

	watchRoute(() => showBanner.value = getRoutePath() === "", true);
</script>

<template>
	<CssDoodle :rule="background" class="background" />
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
		position: relative;
		z-index: 1;
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
		transition: background-color $ease-out-max 250ms;
	}

	.background {
		opacity: 0.3;
	}
</style>
