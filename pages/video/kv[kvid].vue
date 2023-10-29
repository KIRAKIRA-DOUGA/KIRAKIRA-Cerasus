<script setup lang="ts">
	import exampleVideoPath from "assets/videos/shibamata.mp4";
	import { getVideoByKvid } from "~/composables/api/Video/VideoController";
	import type { GetVideoByKvidRequestDto } from "~/composables/api/Video/VideoControllerDto";

	// const exampleVideoPath = "https://video_api.kms233.com/bili/av9912788";
	// 暂时不要用在线视频链接，虽然可以用，但是每次查看视频详细信息我都要等好久。

	const route = useRoute();
	const kvid = +route.params.kvid;
	// const videoDetails = ref<VideoDetail200Response>();
	const videoSource = ref<string>();
	// const recommendations = ref<Videos200ResponseVideosInner[]>();
	// const comments = ref<Comments200ResponseInner[]>([]);
	// const title = computed(() => videoDetails.value?.title ?? "");
	const title = ref<string>();
	const videoDetails = ref();
	const comments: string[] = [];

	/**
	 * Fetch video data.
	 */
	async function fetchData() {
		if (Number.isFinite(kvid)) {
			const getVideoByKvidRequest: GetVideoByKvidRequestDto = { videoId: kvid };
			const videoDataResponse = await getVideoByKvid(getVideoByKvidRequest);
			if (videoDataResponse.success) {
				const videoData = videoDataResponse.video;
				const videoPartData = videoData?.videoPart?.[0]; // TODO 因为要做 分P 视频，所以这里获取到的视频是一个数组，这里暂时取了数组第 0 位。应改进为读取数组中的所有视频，并根据 id 排序渲染成 分P 列表
				if (videoData?.title && videoPartData?.link) {
					videoSource.value = videoPartData.link;
					title.value = videoData.title;
					videoDetails.value = {
						title: videoData.title,
						tags: ["233", "天下笨蛋是一家", "艾拉原创出品"], // TODO TAG 功能还没做好
						username: videoData.uploader || "unknow",
						uploadDate: videoData.updateDate,
					};
				} else
					useToast("获取视频失败，结果异常！", "error"); // TODO 使用多语言
			} else
				useToast("获取视频失败，请求失败！", "error"); // TODO 使用多语言
		} else {
			useToast("未获取到视频 ID，开始使用默认视频！", "error"); // TODO 使用多语言
			videoSource.value = exampleVideoPath;
			videoDetails.value = {
				title: "柴又",
				tags: ["233", "天下笨蛋是一家", "艾拉原创出品"],
				username: "艾了个拉",
				uploadDate: new Date().toString(),
			};
		}
	}
	watch(() => kvid, fetchData);
	await fetchData();

	useHead({
		title: title.value,
		/* meta: [
			{ property: "og:type", content: "video" },
			{ property: "og:title", content: title },
			{ property: "og:description", content: videoDetails.value?.videoDescription },
			{ property: "og:image", content: videoDetails.value?.thumbnail },
			{ property: "og:image:width", content: 1280 },
			{ property: "og:image:height", content: 720 },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: videoDetails.value?.videoDescription },
			{ name: "twitter:image", content: videoDetails.value?.thumbnail },
		], */
	});
</script>

<template>
	<div class="container">
		<PlayerVideo
			v-if="videoSource !== undefined"
			:id="videoDetails?.videoID ?? 0"
			:src="videoSource"
			:rating="videoDetails?.rating ?? 0"
		/>
		<div class="under-player">
			<div class="left">
				<CreationDetail
					:date="new Date(/* videoDetails?.uploadDate! */)"
					category="音MAD"
					:title="videoDetails?.title ?? ''"
					:videoId="videoDetails?.videoID ?? NaN"
					copyright="repost"
					:tags="videoDetails?.tags ?? []"
					:cover="videoDetails?.thumbnail"
				/>

				<p class="description">
					<Preserves>{{ videoDetails?.videoDescription }}</Preserves>
				</p>

				<CreationComments
					:videoId="kvid"
					:count="comments.length"
					:comments="comments"
				/>
			</div>
			<div class="right">
				<CreationUploader
					:uid="videoDetails?.authorID ?? 0"
					:avatar="videoDetails?.profilePicture"
					:username="videoDetails?.username ?? ''"
					:fans="videoDetails?.userSubscribers ?? 0"
					isFollowed
				/>

				<!-- <Subheader
					v-if="(recommendations?.length ?? 0) > 0"
					class="recommendations-header"
					icon="movie"
					:badge="recommendations?.length"
				>{{ t.video_recommendations }}</Subheader>

				<ThumbVideo
					v-for="video in recommendations"
					:key="video.videoID"
					class="video-recomendation"
					:videoId="video.videoID"
					:uploader="video.authorName ?? ''"
					:image="video.thumbnailLoc"
					:date="new Date()"
					:watchedCount="video.views"
					:duration="new Duration(video.videoDuration ?? 0)"
				>{{ video.title }}</ThumbVideo> -->
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@include mobile {
		.player-video {
			margin: -16px -16px 0;
		}
	}

	.recommendations-header {
		margin: 20px 0 5px 5px;
	}

	.video-recomendation {
		max-width: 100%;
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

	.description {
		margin: 1.5rem 0;
	}
</style>
