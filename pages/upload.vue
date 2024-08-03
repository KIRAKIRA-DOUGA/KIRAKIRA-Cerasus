<script setup lang="ts">
	useHead({ title: t.upload });
	const fileInput = ref<HTMLInputElement>();
	const dragover = ref(false);
	const successfulUploaded = ref(false);
	const showEditor = ref(false);
	const files = reactive<File[]>([]);

	const selfUserInfoStore = useSelfUserInfoStore();

	/**
	 * 成功上传文件。
	 * @param fileList - 文件列表。
	 */
	async function uploaded(fileList: File[]) {
		// DELETE ME: 改判定仅测试阶段使用
		if (selfUserInfoStore.role !== "admin") {
			useToast("测试阶段该功能仅限管理员使用。", "warning", 5000);
			return;
		}

		successfulUploaded.value = true;
		if (!isPrefersReducedMotion()) await delay(1500);
		files.push(fileList[0]);
		showEditor.value = true;
	}

	/**
	 * 上传文件无效。
	 */
	function invalidUploaded() {
		successfulUploaded.value = false;
		useToast(t.toast.unsupported_file, "error");
		clearFileInput(fileInput);
	}

	/**
	 * 获取合法的文件列表。
	 * @param fileList - 原生文件列表。
	 * @returns 合法的文件列表。
	 */
	function getValidFiles(fileList?: FileList | null) {
		if (!fileList || !fileList.length) return [];
		const files: File[] = [];
		for (const file of fileList)
			if (file.type.startsWith("video"))
				files.push(file);
		return files;
	}

	/**
	 * 拖放事件。
	 * @param e - 拖放事件。
	 */
	function onDrop(e: DragEvent) {
		dragover.value = false;
		const files = e.dataTransfer?.files;
		if (!files) return;
		const dropFiles = getValidFiles(files);
		if (dropFiles.length)
			uploaded(dropFiles);
		else if (files.length)
			invalidUploaded();
	}

	/**
	 * 上传文件事件。
	 * @param e - 普通事件。
	 */
	function onChangeFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = getValidFiles(input.files);
		// DELETE ME: 改判定仅测试阶段使用
		if (selfUserInfoStore.role !== "admin") {
			useToast("测试阶段该功能仅限管理员使用。", "warning", 5000);
			return;
		}

		if (files.length)
			uploaded(files);
		else if (input.files?.length)
			invalidUploaded();
	}

	/**
	 * 取消本次上传视频。
	 */
	function cancelUpdate() {
		if (!showEditor.value) return;
		if (!confirm(t.confirm.cancel_upload)) return;
		arrayClearAll(files);
		successfulUploaded.value = false;
		showEditor.value = false;
		clearFileInput(fileInput);
	}
</script>

<template>
	<div class="container" :class="{ 'no-scroll': !showEditor }">

		<InfoBar type="warning" title="警告">
			测试阶段该功能仅限管理员使用。
			<!-- TODO: 使用多语言 -->
		</InfoBar>

		<!-- TODO: 临时 SoftButton，之后请在 UploadEditor 的 Submit 按钮左边放一个取消。 -->
		<SoftButton icon="close" v-if="showEditor" @click="cancelUpdate" />
		<input
			ref="fileInput"
			hidden
			type="file"
			multiple
			accept="video/*"
			@change="onChangeFile"
		/>

		<Transition name="page-jump" mode="out-in">
			<div v-if="!showEditor" class="upload-wrapper">
				<div
					v-ripple
					class="upload"
					:class="{ dragover, successful: successfulUploaded }"
					@dragover.stop.prevent="dragover = true"
					@dragenter.stop.prevent="dragover = true"
					@dragleave.stop.prevent="dragover = false"
					@dragend.stop.prevent="dragover = false"
					@drop.stop.prevent="onDrop"
					@click="fileInput?.click()"
				>
					<div class="content">
						<h3>{{ t.upload.drag_to_upload }}</h3>
						<p>{{ t.upload.format_info }}</p>
					</div>
					<Icon name="upload" class="upload-icon" />
					<div class="outline normal"></div>
					<div class="outline successful"></div>
				</div>
			</div>

			<UploadEditor v-else :files />
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	$box-height: 350px;

	.container {
		display: flex;
		flex-direction: column;
		height: calc(100dvh - $banner-height);
	}

	@property --rotation {
		syntax: "<angle>";
		inherits: false;
		initial-value: 0turn;
	}

	.upload-wrapper {
		@include flex-center;
		flex-direction: column;
		height: 100%;
		margin-top: 1rem;

		.upload {
			@include flex-center;
			@include round-large;
			$color: c(gray-60);
			position: relative;
			width: 100%;
			height: $box-height;
			max-height: 100%;
			overflow: clip;
			color: $color;
			text-align: center;
			cursor: pointer;

			&.dragover {
				animation: shake 1s infinite;
			}

			h3 {
				margin-bottom: 8px;
				font-size: 36px;
			}

			.outline {
				@include square(100%);
				@include round-large;
				position: absolute;
				pointer-events: none;

				&.normal {
					border: 2px dashed $color;
				}

				&.successful {
					border: c(accent) 4px solid;
					mask-image: conic-gradient(black var(--rotation), transparent var(--rotation));
				}
			}

			.icon.upload-icon {
				position: absolute;
				color: c(accent);
				font-size: 108px;
				scale: 0;
			}

			&.successful {
				.outline.successful {
					animation: rotation $ease-in-out-smooth 1.5s forwards;
				}

				.content {
					animation: scale-out $ease-in-expo 500ms forwards;
				}

				.icon.upload-icon {
					animation: uploading $ease-out-smooth 1s 500ms forwards;
				}
			}
		}
	}

	@keyframes rotation {
		from {
			--rotation: 0turn;
		}

		to {
			--rotation: 1turn;
		}
	}

	@keyframes uploading {
		0% {
			scale: 0;
		}

		50% {
			translate: 0;
			scale: 1;
		}

		100% {
			translate: 0 calc((-100% - $box-height) / 2);
			scale: 1;
		}
	}
</style>
