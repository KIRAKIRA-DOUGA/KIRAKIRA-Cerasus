<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
	const isAdmin = computed(() => selfUserInfoStore.role === "admin");

	const showDeleteVideoAlert = ref(false);
	const isOpeningDeleteVideoAlert = ref(false);
	const deletedVideoId = ref();
	const deleteVideoInfo = ref<GetVideoByKvidResponseDto["video"]>();
	const isDeletingVideo = ref(false);

	const resultTimestamp = ref(0);
	const pendingReviewVideos = ref<PendingReviewVideoResponseDto>();

	const deletePendingVideoId = ref(-1);
	const deletePendingVideoInfo = ref<GetVideoByKvidResponseDto["video"]>();
	const showDeletePendingVideoAlert = ref(false);
	const isOpeningDeletePendingVideoAlert = ref(false);
	const isDeletingPendingVideo = ref(false);

	const isApprovingPendingVideo = ref(false);

	/**
	 * 开启删除视频的警告框
	 */
	async function openDeleteVideoAlert() {
		const videoId = parseInt(deletedVideoId.value, 10);
		if (deletedVideoId.value === null || deletedVideoId.value === undefined || videoId < 0) {
			useToast("未正确输入视频 ID", "error", 5000);
			return;
		}
		isOpeningDeleteVideoAlert.value = true;
		const getVideoByKvidRequest: GetVideoByKvidRequestDto = {
			videoId,
		};
		const deleteVideoInfoResult = await api.video.getVideoByKvid(getVideoByKvidRequest);
		if (deleteVideoInfoResult.success && deleteVideoInfoResult.video) {
			deleteVideoInfo.value = deleteVideoInfoResult.video;
			showDeleteVideoAlert.value = true;
		} else
			useToast("无法获取目标视频，请检查视频 ID 是否正确", "error", 5000);
		isOpeningDeleteVideoAlert.value = false;
	}

	/**
	 * 删除一个视频
	 */
	async function deleteVideo() {
		const videoId = parseInt(deletedVideoId.value, 10);
		if (deletedVideoId.value === null || deletedVideoId.value === undefined || videoId < 0) {
			useToast("未正确输入视频 ID", "error", 5000);
			return;
		}
		isDeletingVideo.value = true;
		const deleteVideoRequest: DeleteVideoRequestDto = {
			videoId,
		};
		const deleteVideoResult = await api.video.deleteVideo(deleteVideoRequest);
		if (deleteVideoResult.success) {
			showDeleteVideoAlert.value = false;
			deletedVideoId.value = undefined;
			useToast("视频已删除", "success");
		} else
			useToast("无法删除目标视频，请检查视频 ID 是否正确", "error", 5000);
		deleteVideoInfo.value = undefined;
		isDeletingVideo.value = false;
	}

	/**
	 * 开启删除待审核视频的警告框
	 * @param videoId 视频 ID
	 */
	async function openDeletePendingVideoAlert(videoId: number) {
		if (videoId < 0) {
			useToast("视频 ID 不正确", "error", 5000);
			return;
		}
		deletePendingVideoId.value = videoId;
		isOpeningDeletePendingVideoAlert.value = true;
		const getVideoByKvidRequest: GetVideoByKvidRequestDto = {
			videoId,
		};
		const deletePendingVideoInfoResult = await api.video.getVideoByKvid(getVideoByKvidRequest);
		if (deletePendingVideoInfoResult.success && deletePendingVideoInfoResult.video) {
			deletePendingVideoInfo.value = deletePendingVideoInfoResult.video;
			showDeletePendingVideoAlert.value = true;
		} else
			useToast("无法获取目标视频，请检查视频 ID 是否正确", "error", 5000);
		isOpeningDeletePendingVideoAlert.value = false;
	}

	/**
	 * 删除一个待审核视频
	 */
	async function deletePendingVideo() {
		if (deletePendingVideoId.value < 0) {
			useToast("未正确输入视频 ID", "error", 5000);
			return;
		}
		isDeletingPendingVideo.value = true;
		const deletePendingVideoRequest: DeleteVideoRequestDto = {
			videoId: deletePendingVideoId.value,
		};
		const deletePendingVideoResult = await api.video.deleteVideo(deletePendingVideoRequest);
		if (deletePendingVideoResult.success) {
			await getPendingReviewVideo();
			showDeletePendingVideoAlert.value = false;
			deletePendingVideoId.value = -1;
			useToast("待审核视频已删除", "success");
		} else
			useToast("无法删除待审核视频，请检查视频 ID 是否正确", "error", 5000);
		deletePendingVideoInfo.value = undefined;
		isDeletingPendingVideo.value = false;
	}

	/**
	 * 根据 videoId 通过一个待审核视频
	 * @param videoId 视频 ID
	 */
	async function approvePendingReviewVideo(videoId: number) {
		if (videoId < 0) {
			useToast("无法通过视频，视频 ID 不正确", "error", 5000);
			return;
		}
		isApprovingPendingVideo.value = true;
		const approvePendingReviewVideoRequest: ApprovePendingReviewVideoRequestDto = {
			videoId,
		};
		const approvePendingReviewVideoResult = await api.video.approvePendingReviewVideo(approvePendingReviewVideoRequest);
		if (approvePendingReviewVideoResult.success) {
			await getPendingReviewVideo();
			useToast("已通过审核", "success");
		} else
			useToast("无法通过审核，请重试", "success");
		isApprovingPendingVideo.value = false;
	}

	/**
	 * 获取待审核视频列表
	 */
	async function getPendingReviewVideo() {
		const headerCookie = useRequestHeaders(["cookie"]);
		pendingReviewVideos.value = await api.video.getPendingReviewVideo(headerCookie);
	}

	await getPendingReviewVideo();

	definePageMeta(
		{
			middleware: [
				(to: unknown) => {
					const selfUserInfoStore = useSelfUserInfoStore(); // WARN: 此处需要重新创建 Store
					if (selfUserInfoStore.role !== "admin")
						return navigate("/settings/appearance");

					if (to && typeof to === "object" && "path" in to && to.path !== "/settings/content")
						return navigate("/settings/content");
				},
			],
		},
	);
</script>

<template>
	<div>
		<Alert v-model="showDeleteVideoAlert" static>
			<h4>确定要删除这个视频吗？</h4>
			<div class="delete-thumb-video">
				<ThumbVideo
					v-if="deleteVideoInfo"
					:videoId="deleteVideoInfo.videoId"
					:uploader="deleteVideoInfo.uploader ?? ''"
					:uploaderId="deleteVideoInfo.uploaderId"
					:image="deleteVideoInfo.image"
					:date="new Date(deleteVideoInfo.uploadDate || 0)"
					:watchedCount="deleteVideoInfo.watchedCount"
					:duration="new Duration(0, deleteVideoInfo.duration ?? 0)"
					:blank="true"
				>{{ deleteVideoInfo.title }}</ThumbVideo>
			</div>
			<template #footer-left>
				<Button @click="deleteVideo" :loading="isDeletingPendingVideo || isDeletingVideo" :disabled="!isAdmin || isDeletingPendingVideo || isDeletingVideo">确认删除</Button>
			</template>
			<template #footer-right>
				<Button @click="showDeleteVideoAlert = false" class="secondary">取消</Button>
			</template>
		</Alert>

		<Alert v-model="showDeletePendingVideoAlert" static>
			<h4>确定要删除这个待审核视频吗？</h4>
			<div class="delete-thumb-video">
				<ThumbVideo
					v-if="deletePendingVideoInfo"
					:videoId="deletePendingVideoInfo.videoId"
					:uploader="deletePendingVideoInfo.uploader ?? ''"
					:uploaderId="deletePendingVideoInfo.uploaderId"
					:image="deletePendingVideoInfo.image"
					:date="new Date(deletePendingVideoInfo.uploadDate || 0)"
					:watchedCount="deletePendingVideoInfo.watchedCount"
					:duration="new Duration(0, deletePendingVideoInfo.duration ?? 0)"
					:blank="true"
				>{{ deletePendingVideoInfo.title }}</ThumbVideo>
			</div>
			<template #footer-left>
				<Button
					@click="deletePendingVideo"
					:loading="isDeletingPendingVideo || isDeletingVideo"
					:disabled="!isAdmin || isDeletingPendingVideo || isDeletingVideo"
				>
					确认删除
				</Button>
			</template>
			<template #footer-right>
				<Button @click="showDeletePendingVideoAlert = false" class="secondary">取消</Button>
			</template>
		</Alert>

		<div class="delete-video">
			<div class="input">
				<!-- TODO: 使用多语言 -->
				<TextBox
					type="number"
					v-model="deletedVideoId"
					placeholder="删除视频"
					size="large"
					icon="delete"
				/>
				<!-- TODO: 使用多语言 -->
				<span>输入要删除的视频的 KV 号，例如 kv1 只需输入数字 1 即可。</span>
			</div>
			<Button
				@click="openDeleteVideoAlert"
				:disabled="!isAdmin || isOpeningDeleteVideoAlert || isOpeningDeletePendingVideoAlert || isApprovingPendingVideo"
				:loading="isOpeningDeleteVideoAlert || isOpeningDeletePendingVideoAlert || isApprovingPendingVideo"
			>
				删除视频
			</Button>
		</div>

		<!-- TODO: 使用多语言 -->
		<Subheader icon="block">新上传的视频</Subheader>
		<h4>新上传待审核的视频</h4>
		<ThumbGrid :key="resultTimestamp">
			<div
				class="pending-videos"
				v-for="video in pendingReviewVideos?.videos"
				:key="video.videoId"
			>
				<ThumbVideo
					:videoId="video.videoId"
					:uploader="video.uploader ?? ''"
					:uploaderId="video.uploaderId"
					:image="video.image"
					:date="new Date(video.uploadDate || 0)"
					:watchedCount="video.watchedCount"
					:duration="new Duration(0, video.duration ?? 0)"
				>
					{{ video.title }}
				</ThumbVideo>
				<div class="button-group">
					<Button
						class="secondary"
						@click="() => approvePendingReviewVideo(video.videoId)"
						:disabled="!isAdmin || isOpeningDeleteVideoAlert || isOpeningDeletePendingVideoAlert || isApprovingPendingVideo"
						:loading="isOpeningDeleteVideoAlert || isOpeningDeletePendingVideoAlert || isApprovingPendingVideo"
					>
						通过
					</Button>
					<Button
						class="secondary"
						@click="() => openDeletePendingVideoAlert(video.videoId)"
						:disabled="!isAdmin || isOpeningDeleteVideoAlert || isOpeningDeletePendingVideoAlert || isApprovingPendingVideo"
						:loading="isOpeningDeleteVideoAlert || isOpeningDeletePendingVideoAlert || isApprovingPendingVideo"
					>
						删除
					</Button>
				</div>
			</div>
		</ThumbGrid>
	</div>
</template>

<style scoped lang="scss">
	.text-box {
		--size: large;
	}

	.delete-video {
		display: flex;
		gap: 8px;
		align-items: flex-start;

		.input {
			display: flex;

			flex: 1;
			flex-direction: column;
			gap: 8px;

			span {
				color: c(icon-color);
				font-size: 12px;
				text-align: right;
			}
		}

		button {
			margin-top: 3px;
		}
	}

	.delete-thumb-video {
		height: 250px;

		.thumb-video {
			width: 250px;
		}
	}

	.button-group {
		margin-bottom: 30px;
	}
</style>
