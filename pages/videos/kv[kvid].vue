<script setup lang="ts">
	// const videoPath = "https://video_api.kms233.com/bili/av9912788";
	// 暂时不要用在线视频链接，虽然可以用，但是每次查看视频详细信息我都要等好久。

	const route = useRoute();
	const kvid = route.params.kvid;
	const videoDetails = ref<VideoDetail200Response>();
	const videoSource = ref<string>();
	const recommendations = ref<Array<Videos200ResponseVideosInner>>();
	const comments = ref<Comments200ResponseInner[]>([]);

	// Fetch video details
	watch([() => kvid], async () => {
		const api = useApi();
		try {
			const video = await api.videoDetail(kvid);
			videoDetails.value = video;
			videoSource.value = video.mPDLoc;
		} catch (error) {
			console.log(error);
		}
	}, { immediate: true });

	// Fetch comments
	watch(() => kvid, async () => {
		const api = useApi();
		try {
			const commentsResp = await api.comments(kvid);
			for (const comment of commentsResp)
				comments.value.push(comment);
		} catch (error) {
			console.error(error);
		}
	}, { immediate: true });

	// Fetch recommendations
	watch(() => kvid, async () => {
		const api = useApi();
		try {
			const newRecommendations = await api.recommendations(kvid);
			recommendations.value = newRecommendations;
		} catch (error) {
			console.error(error);
		}
	}, { immediate: true });

	useHead({ title: videoDetails.value?.title });
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
					:link="'/videos/kv' + video.videoID ?? ''"
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
</style>
