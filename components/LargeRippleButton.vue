<script setup lang="ts">
	import { LocaleLink } from "#components";

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
		/** 指定点击后跳转的链接。 */
		href?: string;
	}>(), {
		icon: undefined,
		text: undefined,
		appearance: "default",
		href: undefined,
	});

	const emits = defineEmits<{
		(event: "click", payload: MouseEvent): void;
	}>();

	const appearance = computed(() => props.appearance === "default" ? "" : props.appearance);
	/**
	 * 当组件状态是按钮或链接时，各自多余的 Attr。
	 */
	const additionalAttrs = computed(() => !props.href ? {
		type: "button",
	} : {
		class: "lite",
		to: props.href,
		draggable: false,
		activable: true,
	});
</script>

<template>
	<div class="large-ripple-button" :class="[appearance]">
		<component
			:is="href ? LocaleLink : 'button'"
			v-ripple
			:tabindex="nonclickable || nonfocusable ? -1 : ''"
			:disabled="nonclickable"
			v-bind="additionalAttrs"
			@click="(e: MouseEvent) => emits('click', e)"
		>
			<Icon v-if="icon" :name="icon" />
			<span v-if="text"><span>{{ text }}</span></span>
		</component>
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

		> * {
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

			&:active {
				background-color: c(hover-color);
			}

			@media (any-hover: hover) {
				&:hover {
					background-color: c(hover-color);
				}
			}

			&:is(:hover, :active, :has(> .ripple-circle)):not(:focus-visible) {
				@include square(var(--ripple-size));
			}

			&.router-link-active > * {
				color: c(accent);
			}
		}

		&.textbox-aftericon > *:not([tabindex="-1"]):focus-visible {
			@include radius-large;
			@include textbox-aftericon-focus;
		}

		> a {
			pointer-events: auto; // 一个未知 bug，居然可能因 JS 导致伪元素消失。
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
