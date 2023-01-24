<script setup lang="ts">
	function getRoute() {
		console.log("getRouter: ", getRoutePath());
	}
</script>

<template>
	<div class="container">
		<div @click="getRoute">{{ t.videoPlaying }}</div>
		<LocaleLink to="/">Home</LocaleLink>
	</div>
</template>

<i18n lang="json5">
{
	zh: {
		videoPlaying: "视频播放中……",
	},
	en: {
		videoPlaying: "Video Playing...",
	},
	ja: {
		videoPlaying: "動画再生中……",
	},
}
</i18n>

<style scoped lang="scss">
	.container {
		background-color: c(green);
	}
</style>
