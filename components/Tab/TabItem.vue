<script setup lang="ts">
	import type { Property } from "csstype";
	import LocaleLink from "../LocaleLink.vue";
	import TabBar from "./TabBar.vue";

	const props = withDefaults(defineProps<{
		/** 选项卡唯一标识符。 */
		id: string;
		/** 内容排列方向。 */
		direction?: "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";
		/** 角标，可选。 */
		badge?: Readable;
		/** 图标，可选。 */
		icon?: DeclaredIcons;
		/** 超链接目标地址，可选。 */
		to?: string;
		/** @internal 仅内部使用！是否是垂直选项卡？ */
		// eslint-disable-next-line vue/prop-name-casing
		_internalIsVertical?: boolean;
	}>(), {
		direction: "horizontal",
		badge: undefined,
		icon: undefined,
		_internalIsVertical: undefined,
	});

	const emits = defineEmits<{
		click: [e: MouseEvent, id: string];
	}>();

	const parent = useParent(TabBar)!;
	const active = computed(() => parent?.props.modelValue === props.id);
	const flexDirection = computed(() => props.direction === "horizontal" ? undefined :
		props.direction.replace("horizontal", "row").replace("vertical", "column") as Property.FlexDirection);
	const vertical = computed(() => props._internalIsVertical !== undefined ? props._internalIsVertical :
		!!parent?.props.vertical);

	/**
	 * 单击切换选项卡事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		if (!props.to) parent?.exposed?.changeTab(props.id);
		emits("click", e, props.id);
	}
</script>

<template>
	<component
		:is="props.to ? LocaleLink : 'span'"
		:class="{ active, vertical: direction.includes('vertical') }"
		role="tab"
		:aria-selected="active"
		:aria-current="active"
		:to
		class="tab-item lite"
		@click="onClick"
	>
		<div>
			<div v-ripple :style="{ flexDirection }">
				<div class="content">
					<div v-if="icon" class="icon-wrapper">
						<Icon :name="icon" />
					</div>
					<span><slot></slot></span>
					<Badge class="badge"><slot name="badge">{{ badge }}</slot></Badge>
				</div>
			</div>
		</div>
	</component>
</template>

<style scoped lang="scss">
	.tab-item {
		@include flex-center;
		position: relative;
		flex-shrink: 0;
		color: c(icon-color);
		cursor: pointer;

		&:any-hover {
			color: c(text-color);

			> div > div {
				background-color: c(hover-overlay);
			}
		}

		&.active {
			@include accent-ripple;
			color: c(accent);

			&:any-hover > div > div {
				background-color: c(accent-hover-overlay);
			}
		}

		.tab-bar:not(.vertical) & {
			height: 36px;
			font-weight: 500;

			@container style(--loose: true) {
				height: 48px;
			}

			&:active .content {
				@include scale-pressed;
			}

			> div {
				@include ripple-clickable-only-inside(calc(100% + 16px));
				height: unset;
				aspect-ratio: 1;

				> div {
					@include circle;
					justify-content: center;
					align-items: center;
					padding: 0 10px;

					&:is(:hover, :active, :has(> .ripple-circle)):not(:focus-visible) {
						@include square(calc(100% + 16px));
					}

					@container style(--loose: true) {
						padding: 0 16px;
					}
				}
			}
		}

		@container style(--full: true) {
			flex-basis: 0;
			flex-grow: 1;
		}

		> div {
			@include square(100%);
			@include flex-center;

			> div {
				@include square(100%);
				display: flex;
				flex-shrink: 0;
			}
		}

		.content {
			@include square(100%);
			@include flex-center;
			flex-shrink: 0;
			gap: 4px;
		}

		.icon-wrapper {
			height: 18px;
			overflow: visible;

			.icon {
				margin-top: -2px;
				font-size: 22px;
			}

			+ span {
				@include hide-if-empty;
			}
		}

		span {
			@container style(--loose: true) {
				font-size: 16px;
			}
		}

		.badge {
			@include hide-if-empty;
			font-weight: normal;
		}

		.tab-bar.vertical & {
			justify-content: start;
			width: 100%;

			&:any-hover {
				font-weight: 500;

				> div > div {
					background-color: c(hover-overlay);

					> .content {
						translate: 3px 0;
					}
				}
			}

			&:active {
				font-weight: normal;
			}

			&:not(:any-hover) > div > div > .content {
				transition-duration: 1s;
			}

			&.active {
				font-weight: bold;

				&:any-hover {
					font-weight: 800;
				}

				&:active {
					font-weight: 900;
				}

				> div > div {
					background-color: c(accent-hover-overlay);

					&:any-hover,
					&:active {
						background-color: c(accent-hover, 16%);
					}
				}
			}

			> div > div {
				@include round-small;
				min-height: $menu-item-height;
				padding-block: $menu-item-padding-block;
				padding-inline: 12px 8px;

				@include tablet {
					min-height: $menu-item-height-mobile;
					padding-block: $menu-item-padding-block-mobile;
				}
			}

			.content {
				justify-content: start;

				span {
					transition: $fallback-transitions, font-weight 500ms $ease-out-smooth;
				}
			}

			.icon-wrapper {
				margin-right: 8px;
			}
		}
	}
</style>
