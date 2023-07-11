<script setup lang="ts">
	import { DefaultApi, HttpFile } from "kirakira-backend";
	import { DefaultApiRequestFactory } from "kirakira-backend/apis/DefaultApi";
	import { toRaw } from "vue";
	import axios from "axios";
	const contentVisibility = ref<PrivacyType>("public");
	const contentCopyright = ref<Copyright>("original");
	const contentOriginalCreator = ref("");
	const contentOriginalLink = ref("");
	const contentFeedPush = ref(true);
	const copyright = ref<Copyright>("original");
	const title = ref("");
	const originalAuthor = ref("");
	const originalLink = ref("");
	const pushToFeed = ref(true);
	const ensureOriginal = ref(false);
	const file = ref<HTMLInputElement>();

	const tags = ref("");
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
			url: "https://kirakira.dev/api/upload",
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

	const [onContentEnter, onContentLeave] = simpleAnimateSize("height", 500, eases.easeInOutSmooth);
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
					<div class="mask">{{ t.select_cover }}</div>
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

			<div class="right">
				<div class="card">
					<!-- 在这里上传和管理分 P -->
				</div>

				<div class="card">
					<section>
						<Subheader icon="header">{{ t.title }}</Subheader>
						<TextBox v-model="title" required />
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
						<Button icon="check" @click="uploaded(files)">{{ t.upload_with_exclamation }}</Button>
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

	%card-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.card {
		@include round-large;
		@include card-shadow;
		@extend %card-content;
		padding: 1rem;
	}

	.left {
		align-items: center;
		min-width: 250px;
	}

	.right {
		@extend %card-content;
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
		margin-right: 2px;
		color: c(icon-color);
	}

	.submit {
		display: flex;
		justify-content: right;
	}
</style>
