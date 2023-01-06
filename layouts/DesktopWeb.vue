<script setup lang="ts">
	const showBanner = ref(false);
	watchRoute(() => (showBanner.value = getRoutePath() === ""), true);
</script>

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

<style scoped lang="scss">
	.desktop-web {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.main-container-box {
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.kirakira-router-box {
		width: 100%;
		height: 100%;
	}
</style>
