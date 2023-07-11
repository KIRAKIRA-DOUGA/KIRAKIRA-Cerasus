<script setup lang="ts">
	import videoPath from "assets/videos/shibamata.mp4";
	import avatar from "assets/images/aira.webp";
	import { DefaultApi, VideoDetail200Response } from "api";
	import { Comments200ResponseInner } from "kirakirabackend";
	// const videoPath = "https://video_api.kms233.com/bili/av9912788";
	// 暂时不要用在线视频链接，虽然可以用，但是每次查看视频详细信息我都要等好久。

	// this is definitely the wrong way to do this. there's no doubt, lmao
	// what is the right way? TODO
	const router = useRouter();
	const id = +router.currentRoute.value.path.split("/")[2];
	const videoDetails = ref<VideoDetail200Response>();
	const videoLoc = ref(undefined);
	const comments = ref<Comments200ResponseInner>([]);

	// Fetch video details
	watch(() => id, () => {
		const api: DefaultApi = useApi();
		api.videoDetail(id)
			.then(x => {
				videoDetails.value = x;
				videoLoc.value = x.mPDLoc.split(".mpd")[0];
			})
			.catch((error: any) => console.error(error));
	}, { immediate: true });

	// Fetch comments
	watch(() => id, () => {
		const api: DefaultApi = useApi();
		api.comments(id)
			.then(x => {
				for (const comment of x)
					comments.value.push(comment);
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
					:date="new Date()"
					category="音MAD"
					:title="videoDetails?.title ?? ''"
					copyright="repost"
					:tags="videoDetails?.tags ?? []"
				/>

				<CreationComments
					:videoId="id"
					:count="comments.length"
					:comments="comments"
				/>
				<!-- TODO: using v-html, likely unsafe -->
				<!-- TODO: seems to be an issue with default comment newlining (no tags)... maybe a result of using getHTML? -->

			</div>
			<div class="right">
				<CreationUploader
					:id="videoDetails?.authorID ?? 0"
					:avatar="avatar"
					:username="videoDetails?.username ?? ''"
					:fans="233"
					isFollowed
				/>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		padding-top: 0 !important;
		overflow: scroll;

		> * {
			margin: 26px 0;
		}
	}

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
