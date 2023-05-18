<script setup lang="ts">
	import TabBar from "./TabBar.vue";
	import { Property } from "csstype";

	const props = withDefaults(defineProps<{
		id: string;
		direction?: "horizontal" | "horizontal-reverse" | "vertical" | "vertical-reverse";
		badge?: Readable;
		icon?: string;
	}>(), {
		direction: "horizontal",
		badge: undefined,
		icon: undefined,
	});

	const parent = useParent(TabBar)!;
	const active = computed(() => parent.props.modelValue === props.id);
	const flexDirection = computed(() => props.direction === "horizontal" ? undefined : props.direction.replace("horizontal", "row").replace("vertical", "column") as Property.FlexDirection);

	/**
	 * 单击切换选项卡事件。
	 */
	function onClick() {
		parent.exposed?.changeTab(props.id);
	}
</script>

<template>
	<Comp :class="{ active, vertical: direction.includes('vertical') }" :style="{ flexDirection }" @click="onClick">
		<div v-if="icon" class="icon-wrapper">
			<Icon :name="icon" />
		</div>
		<slot></slot>
		<Badge v-if="badge !== undefined" class="badge">{{ badge }}</Badge>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		gap: 4px;
		color: c(icon-color);

		&.active {
			color: c(accent);
			font-weight: bold;
		}

		.icon-wrapper {
			height: 18px;

			.icon {
				margin-top: -2px;
				font-size: 22px;
			}
		}

		.vertical > & {
			@include radius-small;
			justify-content: flex-start;
			width: 100%;
			padding: 8px 8px 8px 12px;

			.icon-wrapper {
				margin-right: 8px;
			}

			.badge {
				width: 100%;
			}

			&:hover,
			&.active {
				background-color: c(hover-color);
			}
		}
	}
</style>
