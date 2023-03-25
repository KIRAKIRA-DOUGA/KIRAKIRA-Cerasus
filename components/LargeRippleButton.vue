<script setup lang="ts">
	const props = defineProps<{
		/** 图标。 */
		icon?: string;
		/** 文本。 */
		text?: Readable;
		/** 是否仅显示图标不可点击。 */
		nonclickable?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "click", payload: MouseEvent): void;
	}>();
</script>

<template>
	<div class="button-wrapper">
		<button v-ripple type="button" :tabindex="nonclickable ? -1 : ''" @click="e => emits('click', e)">
			<NuxtIcon v-if="icon" :name="icon" class="icon" />
			<span v-if="text"><span>{{ text }}</span></span>
		</button>
	</div>
</template>

<style scoped lang="scss">
	$button-wrapper-size: 40px;

	.icon {
		color: c(icon-color);
		font-size: 24px;
	}

	.button-wrapper {
		@include flex-center;
		@include circle;
		@include ripple-clickable-only-inside($button-wrapper-size);

		button {
			@include flex-center;
			@include circle;
			position: relative;
			flex-shrink: 0;
			color: c(icon-color);
			font-weight: 600;
			background: none;
			border: none;
			cursor: pointer;
			appearance: none;

			&:focus-visible {
				@include button-shadow-focus; // TODO: [兰音] 在输入框后方按钮聚焦时太丑，需要单独设置样式。
			}

			&:is(:hover, :active) {
				background-color: c(hover-color);
			}
		}
	}

	@layer utilities {
		.button-wrapper {
			@include square($button-wrapper-size);

			button {
				@include square(40px);

				&:is(:hover, :active, :has(> * + *)):not(:focus-visible) {
					@include square(64px);
				}
			}
		}
	}
</style>
