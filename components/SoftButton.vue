<script setup lang="ts">
	import { LocaleLink } from "#components";

	const props = withDefaults(defineProps<{
		/** 图标。 */
		icon?: DeclaredIcons;
		/** 动态图标。 */
		animatedIcon?: DeclaredLotties;
		/** 动态图标当前状态。 */
		animatedState?: string;
		/** 文本。 */
		text?: Readable;
		/** 是否仅显示图标不可点击？与 disabled 的区别是按钮不会变灰，表示只是展示图标。 */
		nonclickable?: boolean;
		/** 是否不可聚焦但仍可点击？ */
		nonfocusable?: boolean;
		/** 外观偏好。 */
		appearance?: "default" | "textbox-trailingicon";
		/** 指定点击后跳转的链接。 */
		href?: string;
		/** 是否**强制**高亮图标强调色？默认情况下会根据路由自动添加 router-link-active 类。 */
		active?: boolean;
		/** 按钮已禁用？ */
		disabled?: boolean;
	}>(), {
		icon: undefined,
		animatedIcon: undefined,
		animatedState: undefined,
		text: undefined,
		appearance: "default",
		href: undefined,
	});

	const emits = defineEmits<{
		click: [e: MouseEvent];
	}>();

	const appearance = computed(() => props.appearance === "default" ? "" : props.appearance);
	const state = ref<AnimatedIconState>([props.animatedState, false, 0]);
	const changeState = (e: "pressed" | "lifted") => state.value = [[props.animatedState, e].filter(i => i).join(" ")];
	const wrapper = ref<HTMLButtonElement/*  | InstanceType<typeof LocaleLink> */>();

	usePressed(wrapper, () => changeState("pressed"), () => changeState("lifted"));
	watch(() => props.animatedState, animatedState => state.value = [animatedState]);

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
	<Comp role="button" :aria-label="icon">
		<div :class="[appearance]">
			<component
				:is="href ? LocaleLink : 'button'"
				ref="wrapper"
				v-ripple
				:tabindex="nonclickable || nonfocusable ? -1 : ''"
				:disabled="nonclickable || disabled"
				v-bind="additionalAttrs"
				:class="{ 'router-link-active': active, disabled }"
				@click="(e: MouseEvent) => emits('click', e)"
			>
				<Icon v-if="icon" :name="icon" />
				<AnimatedIcon v-if="animatedIcon" :name="animatedIcon" :state="state" />
				<span v-if="text"><span>{{ text }}</span></span>
			</component>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$wrapper-size: 40px;
	$ripple-ratio: calc(64px / 40px);
	$ripple-size: calc(var(--wrapper-size) * $ripple-ratio);
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
			/// 是否**强制**高亮图标强调色？
			--active: false;
			/// 是否使用彩色背景的强制白色图标？
			--white: false;
		}
	}

	.icon,
	.animated-icon {
		font-size: var(--icon-size);
	}

	:comp {
		@include flex-center;
		@include square(var(--wrapper-size));
		@include circle;

		@layer components {
			color: c(icon-color);
		}
	}

	@mixin router-link-active {
		@include accent-ripple;

		> * {
			color: c(accent) !important;

			@container style(--white: true) {
				color: c(white) !important;
			}
		}

		&:any-hover,
		&:active {
			background-color: c(accent-hover-overlay);
		}
	}

	:comp > div {
		@include flex-center;
		@include ripple-clickable-only-inside(var(--wrapper-size));
		color: inherit;
		touch-action: manipulation;

		@container style(--white: true) {
			color: white;
		}

		> * {
			@include flex-center;
			@include square(var(--focus-size));
			@include circle;
			position: relative;
			flex-shrink: 0;
			font-weight: 600;

			&:not([tabindex="-1"]):focus-visible {
				@include button-shadow-focus;
			}

			&:any-hover,
			&:active {
				background-color: c(hover-overlay);
			}

			&:is(:hover, :active, :has(> .ripple-circle)):not(:focus-visible) {
				@include square(var(--ripple-size));
			}

			&.router-link-active {
				@include router-link-active;
			}

			@container style(--active: true) {
				@include router-link-active;
			}

			&.disabled {
				color: c(gray-40);
			}

			@container style(--white: true) {
				:deep(.ripple-circle) {
					background-color: c(white, 15%) !important;
				}

				&:any-hover,
				&:active {
					background-color: c(white, 6%) !important;
				}
			}
		}

		&.textbox-trailingicon > *:not([tabindex="-1"]):focus-visible {
			@include round-large;
			@include textbox-trailingicon-focus;
		}

		* {
			color: inherit;
		}

		> a {
			pointer-events: auto; // 一个未知 bug，居然可能因 JS 导致伪元素消失。
		}
	}
</style>
