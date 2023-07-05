<script setup lang="ts">
	useHead({ title: t.upload });
	const contentVisibility = ref<PrivacyType>("public");
	const contentCopyright = ref<Copyright>("original");
	const contentTitle = ref("");
	const contentOriginalCreator = ref("");
	const contentOriginalLink = ref("");
	const contentFeedPush = ref(true);

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
			<div class="card left">
				<div v-ripple class="cover">
					<!-- 选择封面，裁剪器可以先不做 -->
				</div>

				<Button icon="attachment">关联现有内容</Button>

				<Segmented v-model="contentVisibility">
					<SegmentedItem id="public" icon="visibility">Public</SegmentedItem>
					<SegmentedItem id="private" icon="visibility_off">Private</SegmentedItem>
				</Segmented>

				<Segmented v-model="contentCopyright">
					<SegmentedItem id="original" icon="fact_check">Original</SegmentedItem>
					<SegmentedItem id="repost" icon="local_shipping">Repost</SegmentedItem>
				</Segmented>

				<Transition :css="false" @enter="onContentEnter" @leave="onContentLeave">
					<div v-if="contentCopyright === 'repost'" class="repost-options">
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
			</div>

			<div class="right">
				<div class="card">
					<!-- 在这里上传和管理分P -->
				</div>

				<div class="card">
					<section>
						<Subheader icon="placeholder">Title</Subheader>
						<TextBox v-model="contentTitle" required />
					</section>

					<section>
						<Subheader icon="placeholder">Tags</Subheader>
						<!-- 这里放TAG -->
					</section>

					<section>
						<Subheader icon="placeholder">Description</Subheader>
						<!-- 这里放简介，需要富文本编辑器 -->
					</section>

					<ToggleSwitch v-model="contentFeedPush">
						<icon name="feed" />
						Push to Feed
					</ToggleSwitch>

					<div class="submit">
						<Button icon="check">Upload!</Button>
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
		margin-top: 1rem;
		
		@include tablet {
			flex-direction: column;
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
	}

	.repost-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: hidden;
	}
	
	.left > * {
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
