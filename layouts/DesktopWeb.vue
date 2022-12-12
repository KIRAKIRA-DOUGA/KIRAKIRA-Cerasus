<template>
	<div class="desktop-web">
		<SideBar />
		<div class="main-container-box">
			<Banner :collapsed="!showBanner" />
			<div class="kirakira-router-box">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const showBanner = ref(getRoutePath() === "/");
	watchRoute(route => {
		showBanner.value = route === "/";
	});
</script>

<style lang="scss" scoped>
	.desktop-web {
		display: flex;
		width: var(--full-screen-width);
		height: var(--full-screen-height);
	}

	.main-container-box {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	.kirakira-router-box {
		width: 100%;
		height: 100%;
	}
</style>
