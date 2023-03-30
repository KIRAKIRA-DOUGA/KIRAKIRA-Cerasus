<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图标。 */
		icon?: string;
		/** 文本。 */
		text?: Readable;
		/** 是否仅显示图标不可点击。 */
		nonclickable?: boolean;
		/** 是否不可聚焦但仍可点击。 */
		nonfocusable?: boolean;
		/** 外观偏好。 */
		appearance?: "default" | "textbox-aftericon";
	}>(), {
		icon: undefined,
		text: undefined,
		appearance: "default",
	});

	const emits = defineEmits<{
		(event: "click", payload: MouseEvent): void;
	}>();

	const appearance = computed(() => props.appearance === "default" ? "" : props.appearance);
</script>

<template>
	<div class="large-ripple-button" :class="[appearance]">
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

			&:not([tabindex="-1"]):focus-visible {
				@include button-shadow-focus;
			}

			&:is(:hover, :active) {
				background-color: c(hover-color);
			}

			&:is(:hover, :active, :has(> .ripple-circle)):not(:focus-visible) {
				@include square(var(--ripple-size));
			}
		}

		&.textbox-aftericon button:not([tabindex="-1"]):focus-visible {
			@include radius-large;
			@include textbox-aftericon-focus;
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
