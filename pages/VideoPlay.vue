<script setup lang="ts">
	function getRoute() {
		console.log("getRouter: ", getRoutePath());
	}
</script>

<template>
	<div class="kirakira-video-page-box">
		<div @click="getRoute">{{ t.videoPlaying }}</div>
		<SideBarHomeButton />
	</div>
</template>

<i18n lang="js">
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
	.kirakira-video-page-box {
		background-color: c(green);
	}
</style>
