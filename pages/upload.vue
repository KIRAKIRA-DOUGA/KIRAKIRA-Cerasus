<script setup lang="ts">
	useHead({ title: t.upload });
	const fileInput = ref<HTMLInputElement>();
	const dragover = ref(false);
	const successfulUploaded = ref(false);
	const showEditor = ref(false);
	const files = reactive<File[]>([]);

	/**
	 * 成功上传文件。
	 * @param fileList - 文件列表。
	 */
	async function uploaded(fileList: File[]) {
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
		<ShadingIcon icon="upload" position="right top" />
		<HeadingGroup :name="t.upload" englishName="Upload" :class="{ clickable: showEditor }" @click="cancelUpdate" />
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

			<UploadEditor v-else :files="files" />
		</Transition>
	</div>
</template>

<style scoped lang="scss">
	$box-height: 350px;

	.container {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}
	
	.clickable {
		cursor: pointer !important;
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
			overflow: hidden;
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
					animation: clock $ease-in-out-smooth 1.5s forwards;
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

	@keyframes shake {
		0% {
			transform: translate(1px, 1px) rotate(0);
		}

		10% {
			transform: translate(-1px, -2px) rotate(-1deg);
		}

		20% {
			transform: translate(-3px) rotate(1deg);
		}

		30% {
			transform: translate(3px, 2px) rotate(0);
		}

		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}

		50% {
			transform: translate(-1px, 2px) rotate(-1deg);
		}

		60% {
			transform: translate(-3px, 1px) rotate(0);
		}

		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}

		80% {
			transform: translate(-1px, -1px) rotate(1deg);
		}

		90% {
			transform: translate(1px, 2px) rotate(0);
		}

		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}

	@keyframes clock {
		from {
			--rotation: 0turn;
		}

		to {
			--rotation: 1turn;
		}
	}

	@keyframes scale-out {
		from {
			scale: 1;
		}

		to {
			scale: 0;
		}
	}

	@keyframes uploading {
		0% {
			scale: 0;
		}

		50% {
			scale: 1;
			translate: 0;
		}

		100% {
			scale: 1;
			translate: 0 calc((-100% - $box-height) / 2);
		}
	}
</style>
