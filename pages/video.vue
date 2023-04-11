<script setup lang="ts">
	import videoPath from "assets/videos/shibamata.mp4";
	import avatar from "assets/images/aira.jpg";

	useHead({ title: "测试视频" });
</script>

<template>
	<div class="container">
		<div>{{ t.videoPlaying }}</div>
		<LocaleLink to="/">Home</LocaleLink>
		<PlayerVideo :src="videoPath" />
		<div class="under-player">
			<div class="left">
				<CreationDetail
					:date="new Date()"
					category="音MAD"
					title="柴又"
					isOriginal
					:tags="['233', '天下笨蛋是一家']"
				/>
			</div>
			<div class="right">
				<CreationUploader
					:avatar="avatar"
					username="艾了个拉"
					:fans="233"
					isFollowed
				/>
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

		@media #{$tablet} {
			display: none;
		}
	}
</style>
