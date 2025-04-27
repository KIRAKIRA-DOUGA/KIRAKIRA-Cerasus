<script setup lang="ts">
	const route = useRoute();
	const kvid = +route.params.kvid;
	const videoSource = ref<string>();
	const videoDetails = ref<VideoData>();
	const title = computed(() => videoDetails.value?.title ?? "");
	const thumbnail = computed(() => videoDetails.value?.image || defaultThumbnail);
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言
	// const recommendations = ref<Videos200ResponseVideosInner[]>();
	type VideoData = GetVideoByKvidResponseDto["video"];

	/**
	 * Fetch video data.
	 */
	async function fetchVideoData() {
		const handleError = (message: string, severity: Parameters<typeof useToast>[1] = "error") => {
			onMounted(() => {
				useToast(message, severity);
			});
		};

		if (Number.isFinite(kvid)) {
			const getVideoByKvidRequest: GetVideoByKvidRequestDto = { videoId: kvid };
			const videoDataResponse = await api.video.getVideoByKvid(getVideoByKvidRequest);
			if (videoDataResponse.success) {
				const videoData = videoDataResponse.video;
				const videoPartData = videoData?.videoPart?.[0]; // TODO: 因为要做 分P 视频，所以这里获取到的视频是一个数组，这里暂时取了数组第 0 位。应改进为读取数组中的所有视频，并根据 id 排序渲染成 分P 列表
				if (videoData?.title && videoPartData?.link) {
					videoSource.value = videoPartData.link;
					videoDetails.value = {
						videoPart: videoData.videoPart ?? [],
						title: videoData.title ?? "",
						videoTagList: videoData.videoTagList ?? [],
						uploaderInfo: videoData.uploaderInfo,
						uploadDate: videoData.uploadDate,
						videoId: kvid,
						videoCategory: videoData.videoCategory ?? "",
						copyright: videoData.copyright,
						image: videoData.image,
					};
				} else
					handleError(t.toast.video_invalid_result);
			} else
				handleError(t.toast.video_request_failed);
		} else
			handleError(t.toast.video_no_id);
	}

	watch(() => kvid, fetchVideoData);
	await fetchVideoData();

	useHead({
		title: title.value,
		meta: [
			{ property: "og:type", content: "video" },
			{ property: "og:title", content: title },
			{ property: "og:description", content: videoDetails.value?.description },
			{ property: "og:image", content: videoDetails.value?.image },
			{ property: "og:image:width", content: 1280 },
			{ property: "og:image:height", content: 720 },
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: videoDetails.value?.description },
			{ name: "twitter:image", content: videoDetails.value?.image },
		],
	});
</script>

<template>
	<div class="container">
		<PlayerVideo
			v-if="videoSource !== undefined"
			:id="videoDetails?.videoId ?? 0"
			:src="videoSource"
			:rating="videoDetails?.rating ?? 0"
			:title
			:thumbnail
		/>
		<div class="below-player">
			<div class="left">
				<CreationDetail
					:date="new Date(videoDetails?.uploadDate!)"
					:category="videoDetails?.videoCategory!"
					:title="videoDetails?.title ?? ''"
					:videoId="videoDetails?.videoId ?? NaN"
					:copyright="(videoDetails?.copyright! as Copyright)"
					:tags="videoDetails?.videoTagList.map(tag => getDisplayVideoTagWithCurrentLanguage(currentLanguage, tag)) ?? []"
					:cover="videoDetails?.image"
				/>

				<p class="description">
					<Preserves>{{ videoDetails?.description }}</Preserves>
				</p>

				<!-- 尝试减少SSR时页面上评论的比重来让谷歌索引视频，还不确定是否行。 -->
				<ClientOnly>
					<CreationComments
						:videoId="kvid"
					/>
					<template #fallback>
						<div class="comments-loading">
							<ProgressRing />
						</div>
					</template>
				</ClientOnly>
			</div>
			<div class="right">
				<CreationUploader
					:uid="videoDetails?.uploaderInfo?.uid ?? 0"
					:avatar="videoDetails?.uploaderInfo?.avatar"
					:nickname="videoDetails?.uploaderInfo?.userNickname ?? ''"
					:username="videoDetails?.uploaderInfo?.username ?? ''"
					:fans="videoDetails?.uploaderSubscribers ?? 0"
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
		.player-video:not(.fullscreen) {
			margin: -16px -16px 0;
		}
	}

	.recommendations-header {
		margin: 20px 0 5px 5px;
	}

	.video-recomendation {
		max-width: 100%;
	}

	.below-player {
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

	.container {
		max-width: 1920px;
		margin: 0 auto;
	}

	.comments-loading {
		@include flex-center;
		width: 100%;
	}
</style>
