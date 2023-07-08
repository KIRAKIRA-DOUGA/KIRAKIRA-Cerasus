<script setup lang="ts">
	useHead({ title: t.upload });
	const copyright = ref<Copyright>("original");
	const title = ref("");
	const originalAuthor = ref("");
	const originalLink = ref("");
	const pushToFeed = ref(true);
	const ensureOriginal = ref(false);

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
					<div class="mask">{{ t.select_cover }}</div>
				</div>

				<Button icon="attachment">{{ t.associate_existing }}</Button>

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
					<!-- 在这里上传和管理分P -->
				</div>

				<div class="card">
					<section>
						<Subheader icon="placeholder">{{ t.title }}</Subheader>
						<TextBox v-model="title" required />
					</section>

					<section>
						<Subheader icon="placeholder">{{ t.tags }}</Subheader>
						<div class="tags">
							<Tag>{{ t.press_enter_to_add }}</Tag>
						</div>
					</section>

					<section>
						<Subheader icon="placeholder">{{ t.description_of_creation }}</Subheader>
						<!-- 这里放简介，需要富文本编辑器 -->
					</section>

					<ToggleSwitch v-model="pushToFeed" icon="feed">{{ t.push_to_feed }}</ToggleSwitch>

					<div class="submit">
						<Button icon="check">{{ t.upload_with_exclamation }}</Button>
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
		min-width: 250px;
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

	.repost-options > * {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		
		&.v-enter-active,
		&.v-leave-active {
			overflow: hidden;
		}
	}

	.left > * {
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
