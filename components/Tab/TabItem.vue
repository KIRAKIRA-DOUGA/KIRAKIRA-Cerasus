<script setup lang="ts">
	import TabBar from "./TabBar.vue";
	import type { Property } from "csstype";

	const props = withDefaults(defineProps<{
		/** 选项卡唯一标识符。 */
		id: string;
		/** 内容排列方向。 */
		direction?: "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";
		/** 角标，可选。 */
		badge?: Readable;
		/** 图标，可选。 */
		icon?: DeclaredIcons;
	}>(), {
		direction: "horizontal",
		badge: undefined,
		icon: undefined,
	});

	const emits = defineEmits<{
		click: [e: MouseEvent, id: string];
	}>();

	const parent = useParent(TabBar)!;
	const active = computed(() => parent?.props.modelValue === props.id);
	const flexDirection = computed(() => props.direction === "horizontal" ? undefined :
		props.direction.replace("horizontal", "row").replace("vertical", "column") as Property.FlexDirection);
	const vertical = computed(() => !!parent?.props.vertical);

	/**
	 * 单击切换选项卡事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		parent?.exposed?.changeTab(props.id);
		emits("click", e, props.id);
	}
</script>

<template>
	<Comp
		v-ripple="vertical"
		:class="{ active, vertical: direction.includes('vertical') }"
		role="tab"
		:aria-selected="active"
		:aria-current="active"
		@click="onClick"
	>
		<div v-if="!vertical" v-ripple class="horizontal-ripple"></div>
		<div class="content" :style="{ flexDirection }">
			<div v-if="icon" class="icon-wrapper">
				<Icon :name="icon" />
			</div>
			<span><slot></slot></span>
			<Badge class="badge"><slot name="badge">{{ badge }}</slot></Badge>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-small;
		@include flex-center;
		position: relative;
		flex-shrink: 0;
		color: c(icon-color);
		cursor: pointer;
		font-variation-settings: "wght" 400;

		&:any-hover {
			.horizontal-ripple {
				background-color: c(hover-overlay);
			}
		}

		&.active {
			color: c(accent);
			font-weight: bold;
			font-variation-settings: "wght" 700;

			&:deep(.ripple-circle),
			.horizontal-ripple:hover {
				background-color: c(accent-ripple);
			}
		}

		.tab-bar:not(.vertical) & {
			padding: 8px 10px;
			overflow: visible;

			@container style(--loose: true) {
				padding: 16px;
			}
		}

		.horizontal-ripple {
			@include circle;
			position: absolute;
			width: calc(100% + 16px);
			content: "";
			aspect-ratio: 1 / 1;
		}

		.content {
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

			+ span:empty {
				display: none;
			}
		}

		span {
			@container style(--loose: true) {
				font-size: 16px;
			}
		}

		.badge {
			font-weight: normal;

			&:empty {
				display: none;
			}
		}

		.tab-bar.vertical & {
			justify-content: flex-start;
			width: 100%;
			padding: 8px 12px;

			&:any-hover {
				color: c(text-color);
				background-color: c(hover-overlay);

				>* {
					translate: 3px 0;
				}
			}

			&:not(:any-hover) >* {
				transition-duration: 1s;
			}

			&.active {
				color: c(accent);
				background-color: c(accent-hover-overlay);
			}

			.icon-wrapper {
				margin-right: 8px;
			}

			@include mobile {
				padding: 10px 8px 10px 12px;
			}
		}
	}
</style>
