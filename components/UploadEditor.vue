<script setup lang="ts">
	import axios from "axios";

	const props = defineProps<{
		files: File[];
	}>();

	const copyright = ref<Copyright>("original");
	const title = ref("");
	const category = ref("");
	const originalAuthor = ref("");
	const originalLink = ref("");
	const pushToFeed = ref(true);
	const ensureOriginal = ref(false);
	const thumbnail = ref<File>();
	const thumbnailBlob = ref<string>();
	const thumbnailInput = ref<HTMLInputElement>();

	const tags = ref("");
	const description = ref("");

	const invalidUploaded = () => {
		useEvent("app:toast", { message: "不支持上传所选文件！", severity: "error" });
		clearFileInput(thumbnailInput);
	};

	watch(() => props.files, files => {
		const file = files[0];
		const basename = path.filenameWithoutExtension(file.name);
		title.value = basename;
	}, { immediate: true });

	/**
	 * 验证 MIME 类型。
	 * @param fileList - 文件列表。
	 * @returns 获取符合条件的图片列表。
	 */
	function getValidFiles(fileList?: FileList | null) {
		if (!fileList || !fileList.length) return [];
		const files: File[] = [];
		for (const file of fileList)
			if (file.type.startsWith("image"))
				files.push(file);
		return files;
	}

	/**
	 * 在上传缩略图时调用。
	 * @param e - 普通事件。
	 */
	function onChangeThumbnail(e: Event) {
		const input = e.target as HTMLInputElement;
		const thumbnails = getValidFiles(input.files);
		if (thumbnails.length)
			thumbnailBlob.value = fileToBlob(thumbnail.value = thumbnails[0]);
		else if (input.files?.length)
			invalidUploaded();
	}

	/**
	 * 上传文件。
	 * @param files - 文件列表。
	 */
	function upload(files: File[]) {
		const tagsArray = tags.value.split(",");

		// severe bug in openapi around multiple file uploads using form-data

		const formData = new FormData();
		files.forEach((file, index) => {
			formData.append(`filename[${index}]`, file);
		});

		axios({
			method: "POST",
			// TODO
			url: "https://localhost:3000/api/upload",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
				title: title.value,
				tags: tagsArray.toString(),
				description: description.value,
			},
		});
	}

	const [onContentEnter, onContentLeave] = simpleAnimateSize("height", 500, eases.easeInOutSmooth);
</script>

<template>
	<div class="container">
		<div class="card-container">
			<input
				ref="thumbnailInput"
				hidden
				type="file"
				accept="image/*"
				@change="onChangeThumbnail"
			/>

			<div class="toolbox-card left">
				<div v-ripple class="cover" @click="thumbnailInput?.click()">
					<!-- 选择封面，裁剪器可以先不做 -->
					<div class="mask">{{ t.select_cover }}</div>
					<img :src="thumbnailBlob" alt="thumbnail" :draggable="false" />
				</div>

				<Button icon="disambig">{{ t.associate_existing }}</Button>

				<Segmented v-model="copyright">
					<SegmentedItem id="original" icon="fact_check">{{ t.original }}</SegmentedItem>
					<SegmentedItem id="repost" icon="local_shipping">{{ t.repost }}</SegmentedItem>
				</Segmented>

				<Fragment class="repost-options">
					<Transition mode="out-in" @enter="onContentEnter" @leave="onContentLeave">
						<div v-if="copyright === 'original'">
							<section>
								<Checkbox v-model:single="ensureOriginal">{{ t.ensure_original }}</Checkbox>
							</section>
						</div>
						<div v-else-if="copyright === 'repost'">
							<section>
								<Subheader icon="person">{{ t.original_author }}</Subheader>
								<TextBox v-model="originalAuthor" required />
							</section>

							<section>
								<Subheader icon="link">{{ t.original_link }}</Subheader>
								<TextBox v-model="originalLink" required />
							</section>
						</div>
					</Transition>
				</Fragment>
			</div>

			<div class="center">
				<div class="toolbox-card">
					<!-- 在这里上传和管理分 P -->
				</div>

				<div class="toolbox-card">
					<section>
						<Subheader icon="header">{{ t.title }}</Subheader>
						<TextBox v-model="title" required />
					</section>

					<section>
						<Subheader icon="category">{{ t.category }}</Subheader>
						<ComboBox v-model="category">
							<ComboBoxItem id="anime">{{ t.category_anime }}</ComboBoxItem>
							<ComboBoxItem id="music">{{ t.category_music }}</ComboBoxItem>
							<ComboBoxItem id="otomad">{{ t.category_otomad }}</ComboBoxItem>
							<ComboBoxItem id="tech">{{ t.category_tech }}</ComboBoxItem>
							<ComboBoxItem id="design">{{ t.category_design }}</ComboBoxItem>
							<ComboBoxItem id="game">{{ t.category_game }}</ComboBoxItem>
							<ComboBoxItem id="other">{{ t.category_other }}</ComboBoxItem>
						</ComboBox>
					</section>

					<section>
						<Subheader icon="tag">{{ t.tags }}</Subheader>
						<!-- Tags (comma separated, no spaces) -->
						<!-- <div class="tags">
							<Tag>{{ t.press_enter_to_add }}</Tag>
						</div> -->
						<TextBox v-model="tags" required />

					</section>

					<section>
						<Subheader icon="details">{{ t.description_of_creation }}</Subheader>
						<TextBox v-model="description" required />
						<!-- 这里放简介，需要富文本编辑器 -->
					</section>

					<ToggleSwitch v-model="pushToFeed" icon="feed">{{ t.push_to_feed }}</ToggleSwitch>

					<div class="submit">
						<Button icon="check" @click="upload(files)">{{ t.upload }}</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$card-gap: 24px;
	$center-card-padding: $card-gap;
	$section-gap: $card-gap;
	$subheader-gap: 8px;

	.card-container {
		display: flex;
		gap: $card-gap;
		align-items: flex-start;
		margin-top: 16px;

		@include tablet {
			flex-direction: column;
			align-items: unset;
		}
	}

	.left {
		gap: 16px;
		align-items: center;
		width: unset;
		min-width: 250px;
		padding: 16px;
	}

	.center {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: $card-gap;
		
		.toolbox-card {
			padding: $center-card-padding;
		}
	}

	section {
		display: flex;
		flex-direction: column;
		gap: $subheader-gap;
	}

	.cover {
		@include round-small;
		position: relative;
		width: 300px !important;
		aspect-ratio: 16 / 9;
		background-color: c(gray-20);
		cursor: pointer;

		.mask {
			@include square(100%);
			@include flex-center;
			position: absolute;
			z-index: 5 !important;
			color: white;
			background-color: c(black, 30%);
			opacity: 0;
			pointer-events: none;
		}
		
		&:any-hover {
			.mask {
				opacity: 1;
			}
			
			img {
				filter: brightness(0.75) blur(2px);
				scale: 115%;
			}
		}

		&:not(:any-hover) img {
			transition-duration: 1s;
		}

		img {
			width: 100%;
			aspect-ratio: 16 / 9;
			object-fit: cover;
			
			&:not([src]) {
				visibility: hidden;
			}
		}
		
		:deep(.ripple-circle) {
			z-index: 4;
		}
	}

	.repost-options > * {
		display: flex;
		flex-direction: column;
		gap: $section-gap;
		width: 100%;

		&.v-enter-active,
		&.v-leave-active {
			overflow: hidden;
		}
	}

	.left > *,
	.left > .left-1> * {
		width: 100%;
	}

	.toggle-switch {
		margin-right: 2px;
		color: c(icon-color);
	}

	.submit {
		display: flex;
		justify-content: right;
	}
</style>
