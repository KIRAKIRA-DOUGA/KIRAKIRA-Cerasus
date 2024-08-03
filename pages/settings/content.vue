<script setup lang="ts">
	const selfUserInfoStore = useSelfUserInfoStore();
	const isAdmin = computed(() => selfUserInfoStore.role === "admin");

	const showDeleteVideoAlert = ref(false);
	const isOpeningDeleteVideoAlert = ref(false);
	const deletedVideoId = ref();
	const deleteVideoInfo = ref<GetVideoByKvidResponseDto["video"]>();
	const isDeletingVideo = ref(false);

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
		isDeletingVideo.value = false;
	}

	definePageMeta(
		{
			middleware: [
				(to, from) => {
					// WARN: 此处需要重新创建 Store
					const selfUserInfoStore = useSelfUserInfoStore();
					if (selfUserInfoStore.role !== "admin")
						return navigateTo("/settings/appearance");

					if (to.path !== "/settings/content")
						return navigateTo("/settings/content");
				},
			],
		},
	);
</script>

<template>
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
			<Button @click="deleteVideo" :loading="isDeletingVideo" :disabled="isDeletingVideo">确认删除</Button>
		</template>
		<template #footer-right>
			<Button @click="showDeleteVideoAlert = false" class="secondary">取消</Button>
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
		<Button @click="openDeleteVideoAlert" :disabled="!isAdmin || isOpeningDeleteVideoAlert" :loading="isOpeningDeleteVideoAlert">删除视频</Button>
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
</style>
