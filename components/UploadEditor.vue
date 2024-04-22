<script setup lang="ts">
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
	const thumbnailBlob = ref<string>(); // 封面图 Blob
	const thumbnailUrl = ref<string>("../public/static/images/thumbnail.png"); // 封面图 Blob // FIXME: Nuxt Image 的 src 为 undefined 或 "" 时会出错，见 https://github.com/nuxt/image/issues/1299
	const thumbnailInput = ref<HTMLInputElement>();
	const tags = reactive< Map<VideoTag["tagId"], VideoTag> >(new Map()); // 视频标签
	const currentLanguage = computed(getCurrentLocale); // 当前用户的语言
	const description = ref(""); // 视频简介
	const uploadProgress = ref(0); // 视频上传进度
	const cloudflareVideoId = ref<string>(); // Cloudflare 视频 ID
	const isCommitButtonLoading = ref<boolean>(false); // 投稿按钮是否在 loading 状态
	const isCoverCropperOpen = ref<boolean>(false); // 封面图裁剪器是否开启状态
	const isUploadingCover = ref<boolean>(false); // 是否正在上传封面图
	const cropper = ref(); // 图片裁剪器对象
	const isNetworkImage = computed(() => thumbnailUrl.value === "../public/static/images/thumbnail.png"); // 封面图是静态资源图片还是网图，即用户是否已经上传完成封面图
	const provider = computed(() => isNetworkImage.value ? undefined : "kirakira"); // 根据 isNetworkImage 的值判断是否使用 kirakira 作为 Nuxt Image 提供商
	// 视频分类
	const VIDEO_CATEGORY = new Map([
		["anime", t.category.anime],
		["music", t.category.music],
		["otomad", t.category.otomad],
		["tech", t.category.tech],
		["design", t.category.design],
		["game", t.category.game],
		["misc", t.category.misc],
	]);

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

		if (thumbnails.length) {
			thumbnailBlob.value = fileToBlob(thumbnails[0]);
			isCoverCropperOpen.value = true;
			input.value = ""; // 读取完用户上传的文件后，需要清空 input，以免用户在下次上传同一个文件时无法触发 change 事件。
		} else if (input.files?.length)
			invalidUploaded();
	}

	/**
	 * 清除已经上传完成的图片，释放内存。
	 */
	function clearBlobUrl() {
		if (thumbnailBlob.value) {
			URL.revokeObjectURL(thumbnailBlob.value);
			thumbnailBlob.value = undefined;
		}
	}

	/**
	 * 上传封面图
	 */
	async function handleSubmitCoverImage() {
		isUploadingCover.value = true;
		const blobImageData = await cropper.value?.getCropBlobData();
		const coverUploadSignedUrlResult = await api.video.getVideoCoverUploadSignedUrl();
		const filename = coverUploadSignedUrlResult?.result?.fileName;
		const signedUrl = coverUploadSignedUrlResult?.result?.signedUrl;
		if (coverUploadSignedUrlResult?.success && filename && signedUrl) {
			const uploadVideoCoverResult = await api.video.uploadVideoCover(filename, blobImageData, signedUrl);
			if (uploadVideoCoverResult) {
				thumbnailUrl.value = filename;
				isUploadingCover.value = false;
				isCoverCropperOpen.value = false;
				clearBlobUrl(); // 释放内存
			} else {
				useToast("封面图上传失败，请重试", "error"); // TODO: 使用多语言
				isUploadingCover.value = false;
			}
		} else {
			useToast("封面图上传失败，请重试", "error"); // TODO: 使用多语言
			isUploadingCover.value = false;
			isCoverCropperOpen.value = false;
		}
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
	 * 提交视频（确认投稿）
	 */
	async function commitVideo() {
		if (!cloudflareVideoId.value) {
			useToast("视频没有上传完成", "error"); // TODO: 使用多语言
			return;
		}
		const uid = useSelfUserInfoStore().uid;
		if (!uid) {
			useToast("未登录用户不能上传", "error"); // TODO: 使用多语言
			return;
		}
		if (!title.value) {
			useToast("必须填写标题", "error"); // TODO: 使用多语言
			return;
		}
		if (!description.value) {
			useToast("必须填写简介", "error"); // TODO: 使用多语言
			return;
		}
		if (!category.value) {
			useToast("必须选择分区", "error"); // TODO: 使用多语言
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
			image: isNetworkImage ? thumbnailUrl.value : "f907a7bd-3247-4415-1f5e-a67a5d3ea100", // 没上传封面时使用默认封面图 // TODO: 获取视频截图作为封面
			uploaderId: uid,
			duration: 300, // TODO: 视频时长
			description: description.value,
			videoCategory: category.value,
			copyright: copyright.value,
			originalAuthor: originalAuthor.value,
			originalLink: originalLink.value,
			pushToFeed: pushToFeed.value,
			ensureOriginal: ensureOriginal.value,
			videoTagList: tags ? [...tags.values()] : [],
		};
		isCommitButtonLoading.value = true;
		try {
			const commitVideoResult = await api.video.commitVideo(uploadVideoRequest);
			const videoId = commitVideoResult?.videoId;
			if (commitVideoResult.success && videoId) { // TODO: 视频投稿成功后要做的操作（TODO: 暂时是等待 1 秒后显示纸屑然后跳转到视频页，以后可能需要修改）
				console.log("INFO", `视频投稿成功, KVID: ${videoId}`);
				setTimeout(() => {
					isCommitButtonLoading.value = false;
					showConfetti(); // 显示五彩纸屑。
					navigate(`/video/kv${videoId}`);
				}, 1000);
			}
		} catch (error) {
			isCommitButtonLoading.value = false;
			useToast("视频上传失败", "error"); // TODO: 使用多语言
			console.error("ERROR", "视频提交失败：", error);
		}
	}

	/**
	 * 用户在修改版权选项时，清理其反向对应的版权设置的相关信息。例如，用户在选择为「原创」时，清理“原作者名”和“原视频地址”数据，用户在选择为「搬运」时，将“我声明为原创”取消勾选
	 * @param copyright 版权选项
	 */
	function clearCopyrightData(copyright: Copyright) {
		if (copyright === "original") {
			originalAuthor.value = "";
			originalLink.value = "";
		} else
			ensureOriginal.value = false;
	}

	watch(copyright, copyright => clearCopyrightData(copyright));

	/**
	 * 组件加载后等待三秒开始上传视频文件
	 */
	onMounted(() => setTimeout(() => {
		tusUpload(props.files);
	}, 3000));

	const [onContentEnter, onContentLeave] = simpleAnimateSize("height", 500, eases.easeInOutSmooth);
	const flyoutTag = ref<FlyoutModel>();
</script>

<template>
	<div class="container">
		<!-- TODO: 使用多语言 -->
		<Modal v-model="isCoverCropperOpen" title="上传封面">
			<div class="cover-cropper">
				<ImageCropper
					ref="cropper"
					:image="thumbnailBlob"
					:autoCropWidth="480"
					:autoCropHeight="270"
					:fixed="true"
					:fixedNumber="[16, 9]"
					:full="true"
					:centerBox="true"
					:infoTrue="true"
					:mode="'cover'"
				/>
			</div>
			<template #footer-right>
				<!-- TODO: 使用多语言 -->
				<Button class="secondary" @click="isCoverCropperOpen = false">取消</Button>
				<!-- TODO: 使用多语言 -->
				<Button :loading="isUploadingCover" :disabled="isUploadingCover" @click="handleSubmitCoverImage">上传</Button>
			</template>
		</Modal>

		<div class="card-container">
			<input ref="thumbnailInput" hidden type="file" accept="image/*" @change="onChangeThumbnail" />

			<div class="toolbox-card left">
				<div v-ripple class="cover" @click="thumbnailInput?.click()">
					<div class="mask">{{ t.select_cover }}</div>
					<NuxtImg
						v-if="thumbnailUrl"
						:provider
						:src="thumbnailUrl"
						:width="350"
						alt="thumbnail"
						:draggable="false"
					/>
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
							<ComboBoxItem v-for="CATEGORY in VIDEO_CATEGORY" :id="CATEGORY[0]" :key="CATEGORY[0]">
								{{ CATEGORY[1] }}
							</ComboBoxItem>
						</ComboBox>
					</section>

					<section>
						<Subheader icon="tag">{{ t(2).tag }}</Subheader>
						<div class="tags">
							<Tag v-for="tag in tags" :key="tag[1].tagId" :query="{ q: tag[1].tagId }">{{ getVideoTagNaveWithCurrentLanguage(currentLanguage, tag[1])?.tagNameList[0] }}</Tag>
							<Tag class="add-tag" :checkable="false" @click="e => flyoutTag = [e, 'y']">
								<Icon name="add" />
							</Tag>
						</div>
					</section>

					<FlyoutTag v-model="flyoutTag" v-model:tags="tags" />

					<section>
						<Subheader icon="details">{{ t.description }}</Subheader>
						<TextBox v-model="description" required />
						<!-- TODO: 这里放简介，需要富文本编辑器 -->
					</section>

					<ToggleSwitch v-model="pushToFeed" icon="feed">{{ t.push_to_feed }}</ToggleSwitch>

					<div class="submit">
						<Button
							icon="send"
							:disabled="!cloudflareVideoId || isCommitButtonLoading"
							:loading="!cloudflareVideoId || isCommitButtonLoading"
							@click="commitVideo"
						>
							{{ t.upload }}
						</Button>
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

	.repost-options>* {
		display: flex;
		flex-direction: column;
		gap: $section-gap;
		width: 100%;

		&.v-enter-active,
		&.v-leave-active {
			overflow: clip;
		}
	}

	.left>*,
	.left>.left-1>* {
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

	.cover-cropper {
		width: 520px;
		height: 350px;
		// @include square(350px, true);

		@media (width <=450px) {
			--size: 80dvw;
			// 对于图片切割器，不建议使用响应式，因为切割器内部被切割的图片不会随之改变尺寸，但考虑到极端小尺寸的适配问题，且在上传图片时浏览器宽度发生剧烈变化的概率较小，故保留本功能。
		}
	}
</style>
