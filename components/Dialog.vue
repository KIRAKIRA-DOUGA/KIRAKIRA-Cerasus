<script setup lang="ts">
	const props = defineProps<{
		modelValue?: boolean;
		open?: boolean;
		title?: string;
		static?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", open: boolean): void;
	}>();

	const open = computed({
		get: () => !!(props.modelValue ?? props.open),
		set: value => emits("update:modelValue", value),
	});
	const dialog = ref<HTMLDivElement>();

	watch(open, async open => {
		await nextTick();
		if (!dialog.value) return;
		if (open)
			animateSize(dialog.value, null, { startHeight: 0, duration: 500 });
	}, { immediate: true });
</script>

<template>
	<Mask v-model="open" position="center top" :focusing="static">
		<Transition name="dialog">
			<div v-if="open" ref="dialog" class="dialog">
				<div class="body">
					<NuxtIcon name="info" />
					<div class="content-part">
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
		</Transition>
	</Mask>
</template>

<style scoped lang="scss">
	$max-width: 800px;
	$animation-options: 500ms calc(var(--i) * 100ms) $ease-out-max backwards;
	$padding: 24px;

	.dialog {
		transform-origin: center top;
		transition-timing-function: $ease-out-max;
		transition-duration: 500ms;

		&.dialog-leave-active {
			transition-duration: 250ms;
		}

		&.dialog-enter-from,
		&.dialog-leave-to {
			opacity: 0;
			scale: 1.05;

			.body {
				translate: 0 #{-$padding};
			}

			.footer {
				translate: 0 $padding;
			}
		}

		&.dialog-enter-active,
		&.dialog-leave-active {
			.body {
				overflow: visible;
			}
		}
	}

	// stylelint-disable-next-line no-duplicate-selectors
	.dialog {
		@include dropdown-flyouts;
		@include flex-block;
		width: 100vw;
		max-width: $max-width;
		max-height: var(--inner-height);
		margin: 0 auto;
		overflow: hidden;
		background-color: c(gray-30, 50%);

		@media (min-width: $max-width) {
			@include radius-large;
			$margin-top: 24px;
			max-height: calc(var(--inner-height) - $margin-top * 2);
			margin-top: $margin-top;
		}

		.body {
			@include card-in-card-shadow;
			display: flex;
			gap: 1rem;
			padding: $padding;
			overflow: hidden overlay;
			background-color: c(main-bg, 75%);

			.nuxt-icon {
				@include flex-block;
				--i: 0;
				flex-shrink: 0;
				font-size: 48px;
				animation: intro $animation-options;
			}

			h2 {
				--i: 0;
				margin: 0;
				animation: float-left $animation-options;
			}

			.content {
				--i: 1;
				margin-top: calc($padding / 2);
				animation: float-left $animation-options;
			}

			.content-part {
				width: 100%;

				&::after {
					@include fix-page-end-padding;
				}
			}
		}

		.footer {
			@include flex-center;
			justify-content: space-between;
			padding: 12px $padding;

			.right {
				--i: 2;
				animation: float-left $animation-options;
			}

			.left {
				--i: 2;
				animation: float-right $animation-options;
			}
		}
	}

	@keyframes intro {
		from {
			scale: 0.5;
			opacity: 0;
		}
	}

	@keyframes float-left {
		from {
			translate: 3rem;
			opacity: 0;
		}
	}

	@keyframes float-right {
		from {
			translate: -3rem;
			opacity: 0;
		}
	}
</style>
