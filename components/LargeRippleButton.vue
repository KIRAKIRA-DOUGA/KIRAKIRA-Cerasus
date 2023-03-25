<script setup lang="ts">
	const props = defineProps<{
		/** 图标。 */
		icon?: string;
		/** 文本。 */
		text?: Readable;
		/** 是否仅显示图标不可点击。 */
		nonclickable?: boolean;
		/** 是否不可聚焦但仍可点击。 */
		nonfocusable?: boolean;
	}>();

	const emits = defineEmits<{
		(event: "click", payload: MouseEvent): void;
	}>();
</script>

<template>
	<div class="large-ripple-button">
		<button
			v-ripple
			type="button"
			:tabindex="nonclickable || nonfocusable ? -1 : ''"
			:disabled="nonclickable"
			@click="e => emits('click', e)"
		>
			<NuxtIcon v-if="icon" :name="icon" class="icon" />
			<span v-if="text"><span>{{ text }}</span></span>
		</button>
	</div>
</template>

<style scoped lang="scss">
	$wrapper-size: 40px;
	$ripple-size: 64px;
	$focus-size: var(--wrapper-size);
	$icon-size: 24px;

	.icon {
		color: c(icon-color);
		font-size: var(--icon-size);
	}

	.large-ripple-button {
		@include flex-center;
		@include square(var(--wrapper-size));
		@include circle;
		@include ripple-clickable-only-inside(var(--wrapper-size));

		button {
			@include flex-center;
			@include square(var(--focus-size));
			@include circle;
			position: relative;
			flex-shrink: 0;
			color: c(icon-color);
			font-weight: 600;
			font-size: inherit;
			background: none;
			border: none;
			cursor: pointer;
			appearance: none;

			&:not([tabindex="-1"]):focus-visible {
				@include button-shadow-focus; // TODO: [兰音] 在输入框后方按钮聚焦时太丑，需要额外单独设计样式。
			}

			&:is(:hover, :active) {
				background-color: c(hover-color);
			}

			&:is(:hover, :active, :has(> * + *)):not(:focus-visible) {
				@include square(var(--ripple-size));
			}
		}
	}

	@layer utilities {
		.large-ripple-button {
			--wrapper-size: #{$wrapper-size};
			--ripple-size: #{$ripple-size};
			--focus-size: #{$focus-size};
			--icon-size: #{$icon-size};
		}
	}
</style>
