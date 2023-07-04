<script setup lang="ts">
	import videoPath from "assets/videos/shibamata.mp4";
	import avatar from "assets/images/aira.webp";
	import { DefaultApi, VideoDetail200Response } from "api";
	// const videoPath = "https://video_api.kms233.com/bili/av9912788";
	// 暂时不要用在线视频链接，虽然可以用，但是每次查看视频详细信息我都要等好久。

	// this is definitely the wrong way to do this. there's no doubt, lmao
	// what is the right way? TODO
	const router = useRouter();
	const id = router.currentRoute.value.path.split("/")[2];
	const videoDetails = ref<VideoDetail200Response>();
	const videoLoc = ref(undefined);

	// fetch the videos according to the query
	watch(() => id, () => {
		const api: DefaultApi = API();
		api.videoDetail(id)
			.then(x => {
				videoDetails.value = x;
				videoLoc.value = x.details?.mPDLoc;
				console.log(videoLoc.value);
			})
			.catch((error: any) => console.error(error));
	}, { immediate: true });

	useHead({ title: "柴又" });
</script>

<template>
	<div class="container">
		<PlayerVideo v-if="videoLoc !== undefined" :src="videoLoc" />
		<div class="under-player">
			<div class="left">
				<CreationDetail
					:date="videoDetails?.details?.uploadDate ?? new Date()"
					category="音MAD"
					:title="videoDetails?.details?.title ?? ''"
					copyright="unauthorized-repost"
					:tags="videoDetails?.tags"
				/>
				<CreationComments
					count="233"
				/>
			</div>
			<div class="right">
				<CreationUploader
					:avatar="avatar"
					:username="videoDetails?.details?.username ?? ''"
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
