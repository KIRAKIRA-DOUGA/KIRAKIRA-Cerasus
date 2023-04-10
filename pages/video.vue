<script setup lang="ts">
	import videoPath from "assets/videos/shibamata.mp4";

	useHead({ title: "测试视频" });
</script>

<template>
	<div class="container">
		<div>{{ t.videoPlaying }}</div>
		<LocaleLink to="/">Home</LocaleLink>
		<PlayerVideo :src="videoPath" />
		<div class="under-player">
			<div class="left">
				<CreationDetail />
			</div>
			<div class="right">
				<CreationUploader />
			</div>
		</div>
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
	.under-player {
		display: flex;
		margin-top: 30px;
	}

	.left {
		width: 100%;
	}

	.right {
		flex-shrink: 0;
		width: 350px;
	}
</style>
