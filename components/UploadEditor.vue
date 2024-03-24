<script setup lang="ts">
	import axios from "axios";

	const props = defineProps<{
		files: File[];
	}>();

	const copyright = ref<Copyright>("original"); // 视频版权
	const title = ref(""); // 视频标题
	const category = ref(""); // 视频分类
	const originalAuthor = ref(""); // 原作者
	const originalLink = ref(""); // 原视频链接
	const pushToFeed = ref(true); // 是否发布到动态
	const ensureOriginal = ref(false); // 声明为原创
	const thumbnail = ref<File>(); // 封面图
	const thumbnailBlob = ref<string>("../public/static/images/thumbnail.png"); // 封面图 Blob // FIXME: Nuxt Image 的 src 为 undefined 或 "" 时会出错，见 https://github.com/nuxt/image/issues/1299
	const thumbnailInput = ref<HTMLInputElement>();
	const tags = ref<string[]>([]); // 视频标签
	const description = ref(""); // 视频简介
	const uploadProgress = ref(0); // 视频上传进度
	const cloudflareVideoId = ref<string>(); // Cloudflare 视频 ID

	/**
	 * 上传文件无效。
	 */
	function invalidUploaded() {
		useToast(t.toast.unsupported_file, "error");
		clearFileInput(thumbnailInput);
	}

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
	 * TUS 上传视频文件
	 * @param files - 文件列表。
	 */
	function tusUpload(files: File[]) {
		if (!files || files.length < 1) {
			useToast("无法上传：未找到视频文件", "error"); // TODO: 使用多语言
			return;
		}
		api.video.tusFile(files[0], uploadProgress)?.then((videoId: string) => {
			cloudflareVideoId.value = videoId;
			useToast("上传完成", "success"); // TODO: 使用多语言
		}).catch(error => {
			useToast("上传失败", "error"); // TODO: 使用多语言
			console.error("ERROR", "上传失败：", error);
		});
	}

	/**
	 * 组件加载后等待三秒开始上传视频
	 */
	onMounted(() => setTimeout(() => {
		tusUpload(props.files);
	}, 3000));

	/**
	 * 提交视频
	 */
	async function commitVideo() {
		console.log("TODO", "commit video"); // DELETE ME

		// TODO: 视频封面
		// if (!thumbnail.value) {
		// 	useToast(t.toast.no_cover, "error");
		// 	return;
		// }
		if (!cloudflareVideoId.value) {
			useToast("视频没有上传完成", "error"); // TODO: 使用多语言
			return;
		}
		const uid = useSelfUserInfoStore().uid;
		if (!uid) {
			useToast("用户未登录", "error"); // TODO: 使用多语言
			return;
		}

		const uploadVideoRequest: UploadVideoRequestDto = {
			videoPart: [
				{
					id: 0,
					videoPartTitle: props.files[0].name,
					link: `https://customer-yvgxn6arnuae3q89.cloudflarestream.com/${cloudflareVideoId.value}/manifest/video.mpd`,
				},
			],
			title: title.value,
			image: "f907a7bd-3247-4415-1f5e-a67a5d3ea100", // TODO: 视频封面
			uploaderId: uid,
			duration: 300, // TODO: 视频时长
			description: description.value,
			videoCategory: category.value,
			copyright: copyright.value,
			videoTags: [], // TODO: 视频标签
		};
		await api.video.commitVideo(uploadVideoRequest);
	}

	/**
	 * 上传文件。
	 * @param files - 文件列表。
	 */
	// function upload(files: File[]) {
	// 	if (!thumbnail.value) {
	// 		useToast(t.toast.no_cover, "error");
	// 		return;
	// 	}

	// 	// severe bug in openapi around multiple file uploads using form-data

	// 	const formData = new FormData();
	// 	files.forEach((file, index) => {
	// 		formData.append(`filename[${index}]`, file);
	// 	});

	// 	// oh no no no NO!!!
	// 	formData.append("filename[1]", thumbnail.value);

	// 	axios({
	// 		method: "POST",
	// 		// TODO
	// 		url: "https://localhost:3000/api/upload",
	// 		data: formData,
	// 		headers: {
	// 			"Content-Type": "multipart/form-data",
	// 			title: title.value,
	// 			tags: tags.value.filter(tag => tag).toString(),
	// 			description: description.value,
	// 			category: category.value,
	// 		},
	// 		onUploadProgress(progressEvent) {
	// 			if (progressEvent.total)
	// 				uploadProgress.value = progressEvent.loaded / progressEvent.total * 100;
	// 		},
	// 	});
	// }

	const [onContentEnter, onContentLeave] = simpleAnimateSize("height", 500, eases.easeInOutSmooth);

	const flyoutTag = ref<FlyoutModel>();
</script>

<template>
	<div class="container">
		<div class="card-container">
			<input ref="thumbnailInput" hidden type="file" accept="image/*" @change="onChangeThumbnail" />

			<div class="toolbox-card left">
				<div v-ripple class="cover" @click="thumbnailInput?.click()">
					<!-- 选择封面，裁剪器可以先不做 // TODO: 图片裁剪 -->
					<div class="mask">{{ t.select_cover }}</div>
					<NuxtImg v-if="thumbnailBlob" :src="thumbnailBlob" alt="thumbnail" :draggable="false" />
				</div>

				<Button icon="disambig">{{ t.associate_existing }}</Button>

				<Segmented v-model="copyright">
					<SegmentedItem id="original" icon="fact_check">{{ t.original }}</SegmentedItem>
					<SegmentedItem id="repost" icon="local_shipping">{{ t.repost }}</SegmentedItem>
				</Segmented>

				<Contents class="repost-options">
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
				</Contents>
			</div>

			<div class="center">
				<div class="toolbox-card">
					<!-- 在这里上传和管理分 P -->
					<ProgressBar :value="uploadProgress" />
				</div>

				<div class="toolbox-card">
					<section>
						<Subheader icon="header">{{ t.title }}</Subheader>
						<TextBox v-model="title" required />
					</section>

					<section>
						<Subheader icon="category">{{ t.category }}</Subheader>
						<ComboBox v-model="category">
							<ComboBoxItem id="anime">{{ t.category.anime }}</ComboBoxItem>
							<ComboBoxItem id="music">{{ t.category.music }}</ComboBoxItem>
							<ComboBoxItem id="otomad">{{ t.category.otomad }}</ComboBoxItem>
							<ComboBoxItem id="tech">{{ t.category.tech }}</ComboBoxItem>
							<ComboBoxItem id="design">{{ t.category.design }}</ComboBoxItem>
							<ComboBoxItem id="game">{{ t.category.game }}</ComboBoxItem>
							<ComboBoxItem id="misc">{{ t.category.misc }}</ComboBoxItem>
						</ComboBox>
					</section>

					<section>
						<Subheader icon="tag">{{ t(2).tag }}</Subheader>
						<div class="tags">
							<Tag v-for="tag in tags" :key="tag" :query="{ q: tag }">{{ tag }}</Tag>
							<Tag class="add-tag" @click="e => flyoutTag = [e, 'y']">
								<Icon name="add" />
							</Tag>
						</div>
					</section>

					<FlyoutTag v-model="flyoutTag" />

					<section>
						<Subheader icon="details">{{ t.description }}</Subheader>
						<TextBox v-model="description" required />
						<!-- 这里放简介，需要富文本编辑器 -->
					</section>

					<ToggleSwitch v-model="pushToFeed" icon="feed">{{ t.push_to_feed }}</ToggleSwitch>

					<div class="submit">
						<Button icon="send" :disabled="!cloudflareVideoId" :loading="!cloudflareVideoId" @click="commitVideo">{{ t.upload }}</Button>
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
		flex-shrink: 0;
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
			overflow: clip;
		}
	}

	.left > *,
	.left > .left-1> * {
		width: 100%;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;

		.add-tag {
			padding: 6px;
			color: c(icon-color);
			font-size: 18px;
			aspect-ratio: 1 / 1;
		}
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
