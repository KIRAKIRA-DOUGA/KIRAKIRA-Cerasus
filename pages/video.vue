<script setup lang="ts">
	import videoPath from "assets/videos/test.mp4";

	function getRoute() {
		console.log("getRouter: ", getRoutePath());
	}

	useHead({ title: "测试视频" });
</script>

<template>
	<div class="container">
		<div @click="getRoute">{{ t.videoPlaying }}</div>
		<LocaleLink to="/">Home</LocaleLink>
		<PlayerVideo :src="videoPath" />
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
		padding: 26px 100px;
	}
</style>
