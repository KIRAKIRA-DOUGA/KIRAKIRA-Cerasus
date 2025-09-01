<docs>
	# 文件选择器
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 接受的文件类型。 */
		accept: string;
		/**
		 * #### 封面模式？
		 * * 开启后，图片将填充整个窗格。适用于照片、封面、艺术作品等。
		 * * 关闭后，图片将适应整个窗格以保证图片不被裁切。适用于截图、纸质扫描件、证件照等。
		 */
		cover?: boolean;
		unselectedText?: string;
	}>(), {
		unselectedText: () => t.file_picker.choose,
	});
	const fileInput = ref<HTMLInputElement>();
	const dragover = ref(false);
	const picked = ref(false);
	const succeed = ref(false);
	const files = defineModel<File[]>({ default: [] });
	const file = computed(() => files.value[0]);
	const isImageType = computed(() => !!file.value?.type.startsWith("image"));
	const imageSource = ref<string>();

	// TODO: 使用 showOpenFilePicker() 函数，从此以后就不用再使用那个愚蠢的 input 元素了。

	/**
	 * 成功上传文件。
	 * @param fileList - 文件列表。
	 */
	async function uploaded(fileList: File[]) {
		succeed.value = true;
		if (!isPrefersReducedMotion()) await delay(1500);
		arrayClearAll(files.value);
		files.value.push(fileList[0]);
	}

	/**
	 * 上传文件无效。
	 */
	function invalidUploaded() {
		succeed.value = false;
		useToast(t.toast.unsupported_file, "error");
		clearFileInput(fileInput);
	}

	/**
	 * 获取合法的文件列表。
	 * @param fileList - 原生文件列表。
	 * @returns 合法的文件列表。
	 */
	function getValidFiles(fileList?: FileList | null) {
		if (!fileList || fileList.length === 0) return [];
		const files: File[] = [];
		for (const file of fileList)
			if (file.type.match(props.accept))
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
		if (dropFiles.length > 0)
			uploaded(dropFiles);
		else if (files.length > 0)
			invalidUploaded();
	}

	/**
	 * 上传文件事件。
	 * @param e - 普通事件。
	 */
	function onChangeFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const files = getValidFiles(input.files);
		if (files.length > 0)
			uploaded(files);
		else if (input.files?.length)
			invalidUploaded();
	}

	/**
	 * 取消本次上传。
	 */
	function removePicked() {
		startViewTransition(() => {
			arrayClearAll(files.value);
			succeed.value = false;
			clearFileInput(fileInput);
		});
	}

	/**
	 * 更新图片链接。
	 */
	async function updateImageSrc() {
		imageSource.value = file.value && await fileToData(file.value);
	}

	watch(file, file => {
		startViewTransition(async () => {
			picked.value = !!file;
			await updateImageSrc();
		});
	});
</script>

<template>
	<Comp
		:class="{ dragover, succeed, unpicked: !picked }"
		@dragover.stop.prevent="dragover = true"
		@dragenter.stop.prevent="dragover = true"
		@dragleave.stop.prevent="dragover = false"
		@dragend.stop.prevent="dragover = false"
		@drop.stop.prevent="onDrop"
	>

		<input
			ref="fileInput"
			hidden
			type="file"
			:accept
			@change="onChangeFile"
		/>

		<div
			:class="['container', !picked ? 'select-file' : ['preview', { cover }]]"
			v-ripple="!picked"
			@click="!picked && fileInput?.click()"
		>
			<template v-if="!picked">
				<Icon name="upload" class="upload-icon" />
				<p>{{ unselectedText }}</p>
			</template>

			<template v-else>
				<div class="toolbar">
					<div class="content">
						<Icon name="photo" />
						<p>{{ file?.name }}</p>
					</div>
					<div class="buttons">
						<SoftButton v-tooltip:bottom="t.file_picker.rechoose" icon="upload" @click="fileInput?.click()" />
						<SoftButton v-tooltip:bottom="t.remove" icon="close" @click="removePicked" />
					</div>
					<div class="inner-shadow"></div>
				</div>
				<div v-if="isImageType" class="img-wrapper">
					<img :src="imageSource" alt="preview" />
				</div>
				<div class="inner-shadow"></div>
			</template>
		</div>

		<div v-if="!picked" class="outline normal"></div>
		<div v-if="!picked" class="outline succeed"></div>
	</Comp>
</template>

<style scoped lang="scss">
	$toolbar-height: 36px;

	:comp {
		@include flex-center;
		@include round-large;
		$color: c(icon-color);
		position: relative;
		align-items: flex-start;
		min-height: $toolbar-height;
		overflow: clip;
		view-transition-name: file-picker;

		&.unpicked {
			height: $toolbar-height !important;
		}

		&.dragover {
			animation: shake 1s infinite;
		}

		.outline {
			@include round-large;
			position: absolute;
			inset: 0;
			pointer-events: none;

			&.normal {
				border: 1px dashed $color;
			}

			&.succeed {
				border: c(accent) 2px solid;
				mask-image: conic-gradient(black var(--rotation), transparent var(--rotation));
			}
		}

		.select-file {
			@include flex-center;
			flex-grow: 1;
			gap: 8px;
			padding: 8px 16px;
			color: $color;
			cursor: pointer;

			.icon {
				margin-left: -2px;
				font-size: 20px;
			}
		}

		.preview {
			position: relative;
			width: 100%;
			background-color: c(inset-bg);

			.img-wrapper {
				padding: 8px;
				padding-top: 0;
			}

			img {
				@include chip-shadow-filter;
				width: 100%;
				object-fit: contain;
			}

			.toolbar {
				position: relative;
				z-index: 1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				height: $toolbar-height;
				overflow: clip;

				.content {
					display: flex;
					gap: 8px;
					align-items: center;
					min-width: 0;
					margin-left: 8px;
					color: $color;

					p {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						user-select: text;
					}
				}

				.icon {
					font-size: 20px;
				}

				.buttons {
					display: flex;
					flex-shrink: 0;

					.soft-button {
						--wrapper-size: 36px;
						--icon-size: 20px;
					}
				}
			}

			.inner-shadow {
				@include control-inner-shadow;
				position: absolute;
				inset: 0;
				pointer-events: none;
			}

			&,
			.img-wrapper,
			.img-wrapper img {
				height: 100%;
			}

			&:not(.cover) .img-wrapper {
				height: calc(100% - $toolbar-height);
			}

			&.cover {
				.toolbar {
					@include acrylic-background;
					@include card-shadow-with-blur;
					position: absolute;
				}

				.img-wrapper {
					padding: 0;
				}

				img {
					object-fit: cover;
				}
			}
		}

		&.succeed {
			.outline.succeed {
				animation: rotation $ease-in-out-smooth 1.5s forwards;
			}

			.icon.upload-icon {
				animation: uploading $ease-out-smooth 1s 500ms forwards;
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
			translate: 0;
		}

		50% {
			translate: 0 -100%;
		}

		50.0001% {
			translate: 0 200%;
		}

		100% {
			translate: 0;
		}
	}
</style>

<style lang="scss">
	$transition-duration: 500ms;

	::view-transition-old(file-picker),
	::view-transition-new(file-picker) {
		height: 100%;
		object-fit: cover;
		object-position: center top;
		overflow: clip;
		animation-duration: $transition-duration;
	}

	::view-transition-group(file-picker) {
		animation-duration: $transition-duration;
		animation-timing-function: $ease-in-out-material-emphasized;
	}
</style>
