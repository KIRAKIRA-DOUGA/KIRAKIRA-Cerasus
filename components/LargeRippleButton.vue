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
		click: [payload: MouseEvent];
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
	<Comp :class="[appearance]">
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
	</Comp>
</template>

<style scoped lang="scss">
	$wrapper-size: 40px;
	$ripple-size: 64px;
	$focus-size: var(--wrapper-size);
	$icon-size: 24px;

	@layer props {
		:comp {
			/// 容器大小，即可点击区域大小。
			--wrapper-size: #{$wrapper-size};
			/// 水波纹大小，如和容器大小一致则表示不会有鼠标悬浮的大小变化。
			--ripple-size: #{$ripple-size};
			/// 聚焦大小，当元素聚焦后的固定大小，这会取代容器和水波纹大小的值。
			--focus-size: #{$focus-size};
			/// 图标大小。
			--icon-size: #{$icon-size};
		}
	}

	.icon {
		color: c(icon-color);
		font-size: var(--icon-size);
	}

	:comp {
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
</style>
