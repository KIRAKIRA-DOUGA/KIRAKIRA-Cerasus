<script setup lang="ts">
	const showBanner = ref(false);
	watchRoute(() => (showBanner.value = getRoutePath() === ""), true);
</script>

<template>
	<div class="desktop">
		<SideBar />
		<div class="container">
			<Banner :collapsed="!showBanner" />
			<div class="page">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.desktop {
		$resize-duration: 100ms;
		display: flex;
		width: 100vw;
		height: 100vh;
		transition: $fallback-transitions, width $resize-duration, height $resize-duration;
	}

	.container {
		@include square(100%);
		overflow: hidden auto;
	}

	.page {
		@include square(100%);
	}
</style>
