<script setup lang="ts">
	useHead({ title: t.upload });
	const file = ref<HTMLInputElement>();
	const dragover = ref(false);
	const successfulUploaded = ref(false);
	const showEditor = ref(false);
	const fileArr: File[] = [];
	const uploaded = (files: File[]) => {
		successfulUploaded.value = true;
		// await delay(1500);
		// navigate("/upload/edit");
		fileArr.push(files[0]);
		showEditor.value = true;
	};
	const invalidUploaded = () => {
		successfulUploaded.value = false;
		useEvent("app:toast", { message: "不支持上传所选文件！", severity: "error" });
	};

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
</script>

<template>
	<div class="container">
		<ShadingIcon icon="upload" position="right top" />
		<HeadingGroup :name="t.upload" englishName="Upload" />
		<input
			ref="file"
			hidden
			type="file"
			multiple
			accept="video/*"
			@change="onChangeFile"
		/>

		<div class="upload-wrapper">
			<div
				class="upload"
				:class="{ dragover, successful: successfulUploaded }"
				@dragover.stop.prevent="dragover = true"
				@dragenter.stop.prevent="dragover = true"
				@dragleave.stop.prevent="dragover = false"
				@dragend.stop.prevent="dragover = false"
				@drop.stop.prevent="onDrop"
				@click="file?.click()"
			>
				<div class="content">
					<h3>拖到此处上传</h3>
					<p>支持MP4、WMV、WEBM等主流格式</p>
				</div>
				<Icon name="upload" class="upload-icon" />
				<div class="outline normal"></div>
				<div class="outline successful"></div>
			</div>
		</div>
		<UploadEditor v-if="showEditor" :files="fileArr" />
	</div>
</template>

<style scoped lang="scss">
	$box-height: 350px;

	.container {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;
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
					border: 4px solid c(accent);
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