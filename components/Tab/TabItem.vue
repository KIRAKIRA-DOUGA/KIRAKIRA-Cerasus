<script setup lang="ts">
	import TabBar from "./TabBar.vue";
	import { Property } from "csstype";

	const props = withDefaults(defineProps<{
		/** 选项卡唯一标识符。 */
		id: string;
		/** 内容排列方向。 */
		direction?: "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";
		/** 角标，可选。 */
		badge?: Readable;
		/** 图标，可选。 */
		icon?: string;
	}>(), {
		direction: "horizontal",
		badge: undefined,
		icon: undefined,
	});

	const emits = defineEmits<{
		click: [e: MouseEvent, id: string];
	}>();

	const parent = useParent(TabBar)!;
	const active = computed(() => parent.props.modelValue === props.id);
	const flexDirection = computed(() => props.direction === "horizontal" ? undefined : props.direction.replace("horizontal", "row").replace("vertical", "column") as Property.FlexDirection);
	const vertical = computed(() => !!parent?.props.vertical);

	/**
	 * 单击切换选项卡事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		parent.exposed?.changeTab(props.id);
		emits("click", e, props.id);
	}
</script>

<template>
	<Comp
		v-ripple="vertical"
		:class="{ active, vertical: direction.includes('vertical') }"
		:style="{ flexDirection }"
		role="tab"
		:aria-selected="active"
		:aria-current="active"
		@click="onClick"
	>
		<div v-if="icon" class="icon-wrapper">
			<Icon :name="icon" />
		</div>
		<span><slot></slot></span>
		<Badge v-if="badge !== undefined" class="badge">{{ badge }}</Badge>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		flex-shrink: 0;
		gap: 4px;
		color: c(icon-color);
		cursor: pointer;

		&.active {
			color: c(accent);
			font-weight: bold;
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
		}
		// TODO: 缺少横向 Tab 的 hover 和 pressed 样式，但不要用水波纹，你用了就知道有多丑了。

		.tab-bar.vertical > * > & {
			@include round-small;
			justify-content: flex-start;
			width: 100%;
			padding: 8px 8px 8px 12px;

			.icon-wrapper {
				margin-right: 8px;
			}

			&:any-hover {
				background-color: c(hover-film);
			}

			&.active {
				background-color: c(hover-film);
			}
		}
	}
</style>
