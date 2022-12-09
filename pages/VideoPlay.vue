<script setup lang="ts">
	function getRoute() {
		console.log("getRouter: ", getRoutePath());
	}
</script>
<template>
	<div class="kirakira-video-page-box">
		<div @click="getRoute">video playing....</div>
		<SideBarHomeButton />
	</div>
</template>

<style scoped lang="scss">
	.kirakira-video-page-box {
		background-color: c(green);
	}
</style>
