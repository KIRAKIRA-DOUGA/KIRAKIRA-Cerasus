<script setup lang="ts">
	const props = defineProps<{
		modelValue?: boolean;
		open?: boolean;
		title?: string;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});
	const dialog = ref<HTMLDivElement>();
	const mask = ref<HTMLDivElement>();

	watch(open, async open => {
		await nextTick();
		if (!dialog.value) return;
		if (open)
			animateHeight(dialog.value, null, { startHeight: 0, duration: 500 });
	}, { immediate: true });

	/**
	 * 单击遮罩部分关闭内容。
	 * @param e - 鼠标单击事件。
	 */
	function close(e: MouseEvent) {
		if (e.target === mask.value) // 单击的最终元素必须是遮罩本身，不能是其内容。
			emits("update:modelValue", false);
	}
</script>

<template>
	<Mask v-model="open" />
	<ClientOnlyTeleport to="body">
		<Transition name="dialog">
			<div v-if="open" ref="mask" class="dialog-container" @click="close">
				<div ref="dialog" class="dialog">
					<div class="body">
						<NuxtIcon name="info" class="icon" />
						<div>
							<h2>{{ title ?? "KIRAKIRA 提示您" }}</h2>
							<div class="content">
								<slot><em>没有内容。</em></slot>
							</div>
						</div>
					</div>
					<div class="footer">
						<div class="left">
							<slot name="footer-left"></slot>
						</div>
						<div class="right">
							<slot name="footer-right">
								<Button @click="emits('update:modelValue', false)">了然</Button>
							</slot>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	</ClientOnlyTeleport>
</template>

<style scoped lang="scss">
	$max-width: 800px;
	$animation-options: 500ms calc(var(--i) * 100ms) $ease-out-max backwards;
	$padding: 24px;

	.dialog-container {
		@include full-screen;
		z-index: 50;
		transform-origin: center top;

		&.dialog-enter-from,
		&.dialog-leave-to {
			opacity: 0;
			scale: 1.1;

			.body {
				translate: 0 #{-$padding};
			}

			.footer {
				translate: 0 $padding;
			}
		}
	}

	.dialog {
		@include dropdown-flyouts;
		@include flex-block;
		width: 100vw;
		max-width: $max-width;
		max-height: 100vh;
		margin: 0 auto;
		overflow: hidden;
		background-color: c(inner-color-85, 50%);

		@media (min-width: $max-width) {
			@include radius-large;
		}

		.body {
			@include card-in-card-shadow;
			display: flex;
			gap: 1rem;
			height: 80%;
			padding: $padding;
			overflow: hidden;
			background-color: c(white, 75%);

			.icon {
				@include flex-block;
				$size: 48px;
				--i: 0;
				height: $size;
				font-size: $size;
				animation: scale-in $animation-options;
			}

			h2 {
				--i: 0;
				margin: 0 0 12px;
				animation: move-left $animation-options;
			}

			.content { // TODO: 内容太多，下方按钮就会看不到了。待解决。
				--i: 1;
				overflow: auto;
				animation: move-left $animation-options;
			}
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 12px $padding;

			.right {
				--i: 2;
				animation: move-left $animation-options;
			}

			.left {
				--i: 2;
				animation: move-right $animation-options;
			}
		}
	}

	@keyframes scale-in {
		from {
			scale: 0.5;
			opacity: 0;
		}
	}

	@keyframes move-left {
		from {
			translate: 3rem;
			opacity: 0;
		}
	}

	@keyframes move-right {
		from {
			translate: -3rem;
			opacity: 0;
		}
	}
</style>
