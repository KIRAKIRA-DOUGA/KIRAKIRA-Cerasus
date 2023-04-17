<script setup lang="ts">
	// import videoPath from "assets/videos/shibamata.mp4";
	import avatar from "assets/images/aira.jpg";
	const videoPath = "https://video_api.kms233.com/bili/av9912788";

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
					isOriginal
					:tags="['233', '天下笨蛋是一家']"
				/>
				<CreationComments
					count="233"
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
