<script setup lang="ts">
	import { DefaultApi, HttpFile } from "kirakirabackend";
	import { DefaultApiRequestFactory } from "kirakirabackend/apis/DefaultApi";
	import { toRaw } from "vue";
	import axios from "axios";
	useHead({ title: t.upload });
	const contentVisibility = ref<PrivacyType>("public");
	const contentCopyright = ref<Copyright>("original");
	const contentOriginalCreator = ref("");
	const contentOriginalLink = ref("");
	const contentFeedPush = ref(true);
	const ensureOriginal = ref(false);
	const file = ref<HTMLInputElement>();

	const tags = ref("");
	const title = ref("");
	const description = ref("");

	/** validates mime type */
	function getValidFiles(fileList?: FileList | null) {
		if (!fileList || !fileList.length) return [];
		const files: Any[] = [];
		for (const file of fileList)
			if (file.type.startsWith("image"))
				files.push(file);
		return files;
	}

	const props = defineProps<{
		files;
	}>();

	/** called on uploading a thumbnail */
	function onChangeThumb(e: Event) {
		const input = e.target as HTMLInputElement;
		const filesInp = getValidFiles(input.files);
		if (filesInp.length)
			props.files.push(filesInp[0]);
		else if (input.files?.length)
			invalidUploaded();
	}
	const uploaded = async (files: Array<File>) => {
		const tagsArr = tags.value.split(",");

		// severe bug in openapi around multiple file uploads using form-data

		const formData = new FormData();
		files.forEach((file, idx) => {
			formData.append(`filename[${idx}]`, file);
		});

		axios({
			method: "POST",
			// TODO
			url: "http://localhost:3000/api/upload",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
				title: title.value,
				tags: tagsArr.toString(),
				description: description.value,
			},
		});
	};

	const invalidUploaded = () => {
		useEvent("app:toast", { message: "不支持上传所选文件！", severity: "error" });
	};

	/**
	 * 在元素被插入到 DOM 之后的下一帧被调用。
	 * 用这个来开始进入动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentEnter(el: Element, done: () => void) {
		await animateSize(el, null, { startHeight: 0, duration: 500, easing: eases.easeInOutSmooth });
		done();
	}

	/**
	 * 在离开过渡开始时调用。
	 * 用这个来开始离开动画。
	 * @param el - HTML DOM 元素。
	 * @param done - 调用回调函数 done 表示过渡结束。
	 */
	async function onContentLeave(el: Element, done: () => void) {
		await animateSize(el, null, { endHeight: 0, duration: 500, easing: eases.easeInOutSmooth });
		done();
	}
</script>

<template>
	<div class="container">
		<ShadingIcon icon="upload" position="right top" />
		<HeadingGroup :name="t.upload" englishName="Upload" />

		<div class="card-container">
			<input
				ref="file"
				hidden
				type="file"
				multiple
				accept="image/*"
				@change="onChangeThumb"
			/>
			<div class="card left">
				<div v-ripple class="cover" @click="file?.click()">
					<!-- 选择封面，裁剪器可以先不做 -->

					<div class="mask">
						Set thumbnail
					</div>
				</div>

				<Button icon="attachment">{{ t.associate_existing }}</Button>

				<Segmented v-model="contentVisibility">
					<SegmentedItem id="public" icon="visibility">Public</SegmentedItem>
					<SegmentedItem id="private" icon="visibility_off">Private</SegmentedItem>
				</Segmented>

				<Segmented v-model="contentCopyright">
					<SegmentedItem id="original" icon="fact_check">Original</SegmentedItem>
					<SegmentedItem id="repost" icon="local_shipping">Repost</SegmentedItem>
				</Segmented>

				<Fragment class="repost-options">
					<Transition mode="out-in" @enter="onContentEnter" @leave="onContentLeave">
						<div v-if="contentCopyright === 'original'">
							<section>
								<Checkbox v-model:single="ensureOriginal">我声明此作品为原创</Checkbox>
							</section>
						</div>
						<div v-else-if="contentCopyright === 'repost'">
							<section>
								<Subheader icon="person">Original Creator</Subheader>
								<TextBox v-model="contentOriginalCreator" required />
							</section>

							<section>
								<Subheader icon="link">Original Link</Subheader>
								<TextBox v-model="contentOriginalLink" required />
							</section>
						</div>
					</Transition>
				</Fragment>
			</div>

			<div class="right">
				<div class="card">
					<!-- 在这里上传和管理分P -->
				</div>

				<div class="card">
					<section>
						<Subheader icon="placeholder">Title</Subheader>
						<TextBox v-model="title" required />
					</section>

					<section>
						<Subheader icon="placeholder">Tags (comma separated, no spaces)</Subheader>
						<TextBox v-model="tags" required />

					</section>

					<section>
						<Subheader icon="placeholder">Description</Subheader>
						<TextBox v-model="description" required />
						<!-- 这里放简介，需要富文本编辑器 -->
					</section>

					<ToggleSwitch v-model="contentFeedPush">
						<icon name="feed" />
						Push to Feed
					</ToggleSwitch>

					<div class="submit">
						<Button icon="check" @click="uploaded(files)">Upload!</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.card-container {
		display: flex;
		gap: 1.5rem;
		align-items: flex-start;
		margin-top: 1rem;

		@include tablet {
			flex-direction: column;
			align-items: unset;
		}
	}

	%card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card {
		@include round-large;
		@include card-shadow;
		@extend %card;
		padding: 1rem;
	}

	.left {
		align-items: center;
	}

	.right {
		@extend %card;
		flex-grow: 1;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.subheader {
		margin-top: 0.5rem;

		&:first-child {
			margin-top: 0
		}
	}

	.cover {
		@include round-small;
		width: 100%;
		aspect-ratio: 16 / 9;
		max-width: 300px;
		background-color: c(gray-20);
		cursor: pointer;

		.mask {
			@include square(100%);
			@include flex-center;
			color: white;
			background-color: c(black, 30%);
			opacity: 0;
			pointer-events: none;
		}

		&:hover .mask {
			opacity: 1;
		}
	}

	.repost-options>* {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;

		&.v-enter-active,
		&.v-leave-active {
			overflow: hidden;
		}
	}

	.left>* {
		width: 100%;
	}

	.toggle-switch {
		display: flex;
		height: 36px;
		margin-right: 2px;
		color: c(icon-color);

		:deep(.content) {
			gap: 0.5rem;

			.icon {
				font-size: 24px;
			}
		}
	}

	.submit {
		display: flex;
		justify-content: right;
	}
</style>
