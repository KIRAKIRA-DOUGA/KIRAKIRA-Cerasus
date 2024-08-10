<docs>
	# 卡片内复选框
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图片。 */
		image?: string;
	}>(), {
		image: undefined,
	});

	const checked = defineModel<boolean>({ default: false });
</script>

<template>
	<Comp role="checkbox" :aria-checked="checked" :class="{ checked }" :tabindex="0" @click="checked = !checked">
		<div v-ripple class="card">
			<slot name="image"><NuxtImg :src="image" /></slot>
			<div class="overlay"></div>
			<div class="float">
				<Checkbox v-model:single="checked" readonly />
			</div>
		</div>
		<p class="text"><slot></slot></p>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 卡片宽度。
			--width: 208px;
			/// 卡片高度。
			--height: 117px;
			/// 卡片宽高比。
			--aspect-ratio: auto;
			/// 复选框到卡片左上角的距离。
			--float-offset: 12px;
		}
	}

	:comp {
		display: inline-block;
	}

	.card {
		@include round-large;
		position: relative;
		width: var(--width);
		height: var(--height);
		aspect-ratio: var(--aspect-ratio);
		background-color: c(gray-20);
		outline: 1px solid transparent;
		cursor: pointer;

		:comp:is(:any-hover, :focus-visible) & {
			outline-color: c(gray-40);
		}

		:comp:active & {
			@include button-scale-pressed;
		}

		:comp.checked & {
			@include accent-ripple;
			outline-color: c(accent);
		}

		.float {
			@include round-small;
			@include card-shadow-with-blur;
			position: absolute;
			top: var(--float-offset);
			left: var(--float-offset);
			z-index: 5;
			padding: 11px;
			background-color: c(main-bg, 50%);
			pointer-events: none;

			:comp:not(.checked, :any-hover, :focus-visible) & {
				opacity: 0;
			}
		}

		.overlay {
			@include square(100%);
			position: absolute;
			top: 0;
			left: 0;
			background-color: c(accent, 40%);

			:comp:not(.checked) & {
				opacity: 0;
			}
		}

		&:deep(.ripple-circle) {
			z-index: 4;
		}

		> :deep(img) {
			@include square(100%);
			object-fit: cover;
		}
	}

	.text {
		@include hide-if-empty;
		margin-top: 8px;
	}
</style>
