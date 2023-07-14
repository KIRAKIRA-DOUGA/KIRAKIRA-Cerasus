<script setup lang="ts">
	import videoPath from "assets/videos/shibamata.mp4";
	// const videoPath = "https://video_api.kms233.com/bili/av9912788";
	// 暂时不要用在线视频链接，虽然可以用，但是每次查看视频详细信息我都要等好久。

	useHead({ title: "柴又" });
</script>

<template>
	<div class="container">
		<PlayerVideo :src="videoPath" />
		<div class="under-player">
			<div class="left">
				<CreationDetail
					:date="new Date()"
					category="音MAD"
					title="柴又"
					copyright="repost"
					:tags="['233', '天下笨蛋是一家', '艾拉原创出品']"
				/>
				<CreationComments
					:count="233"
				/>
			</div>
			<div class="right">
				<CreationUploader
					username="艾了个拉"
					:fans="233"
					isFollowed
				/>
			</div>
		</div>
	</div>
</template>

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

		@include tablet {
			display: none;
		}
	}
</style>
