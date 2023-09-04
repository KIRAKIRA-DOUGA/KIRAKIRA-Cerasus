<script setup lang="ts">
	// const videoPath = "https://video_api.kms233.com/bili/av9912788";
	// 暂时不要用在线视频链接，虽然可以用，但是每次查看视频详细信息我都要等好久。

	const route = useRoute();
	const kvid = +route.params.kvid;
	const videoDetails = ref<VideoDetail200Response>();
	const videoSource = ref<string>();
	const recommendations = ref<Videos200ResponseVideosInner[]>();
	const comments = ref<Comments200ResponseInner[]>([]);
	const title = computed(() => videoDetails.value?.title ?? "");

	/**
	 * Fetch video data.
	 */
	async function fetchData() {
		const api = useApi();
		const handleError = (e: unknown) => console.error(e);

		// Fetch video details
		try {
			const video = await api.videoDetail(kvid);
			videoDetails.value = video;
			videoSource.value = video.mPDLoc;
		} catch (error) { handleError(error); }

		// Fetch comments
		try {
			const commentsResp = await api.comments(kvid);
			for (const comment of commentsResp)
				comments.value.push(comment);
		} catch (error) { handleError(error); }

		// Fetch recommendations
		try {
			// const commentsResp = await api.comments(kvid);
			// for (const comment of commentsResp)
			// 	comments.value.push(comment);
			// TODO: Fetch recommendations
		} catch (error) { handleError(error); }
	}
	watch(() => kvid, fetchData);
	await fetchData();

	useHead({
		title,
		meta: [
			{ property: "og:type", content: "video" },
			{ property: "og:title", content: title },
			{ property: "og:description", content: videoDetails.value?.videoDescription },
			// { property: "og:image", content: "" }, // TODO: We should get the video thumbnail here.
			{ name: "twitter:title", content: title },
			{ name: "twitter:description", content: videoDetails.value?.videoDescription },
			// { name: "twitter:image", content: "" }, // TODO: We should get the video thumbnail here.
		],
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
					:date="new Date(videoDetails?.uploadDate!)"
					category="音MAD"
					:title="videoDetails?.title ?? ''"
					copyright="repost"
					:tags="videoDetails?.tags ?? []"
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
				<Subheader v-if="recommendations?.length !== undefined && recommendations?.length > 0" class="recheader" icon="movie" :badge="recommendations?.length">Recommendations </Subheader>
				<ThumbVideo
					v-for="video in recommendations"
					:key="video.videoID"
					class="videorec"
					:videoId="video.videoID"
					:uploader="video.authorName ?? ''"
					:image="video.thumbnailLoc"
					:date="new Date()"
					:watchedCount="video.views"
					:duration="new Duration(0, video.videoDuration ?? 0)"
				>{{ video.title }}</ThumbVideo>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.player-video {
		margin: -16px -16px 0;
	}

	.recheader {
		margin-top: 20px;
		margin-bottom: 5px;
		margin-left: 5px;
	}

	.videorec {
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
