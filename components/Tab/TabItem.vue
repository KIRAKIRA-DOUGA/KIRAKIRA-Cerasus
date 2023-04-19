<script setup lang="ts">
	import TabBar from "./TabBar.vue";
	import { FlexDirectionProperty } from "csstype";

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
	const flexDirection = computed(() => props.direction === "horizontal" ? undefined : props.direction.replace("horizontal", "row").replace("vertical", "column") as FlexDirectionProperty);

	/**
	 * 单击切换选项卡事件。
	 */
	function onClick() {
		parent.exposed?.changeTab(props.id);
	}
</script>

<template>
	<div class="tab-item" :class="{ active, vertical: direction.includes('vertical') }" :style="{ flexDirection }" @click="onClick">
		<div v-if="icon" class="icon-wrapper">
			<NuxtIcon :name="icon" />
		</div>
		<slot></slot>
		<Badge v-if="badge !== undefined">{{ badge }}</Badge>
	</div>
</template>

<style scoped lang="scss">
	.tab-item {
		@include flex-center;
		gap: 8px;

		&.active {
			color: c(accent);
			font-weight: bold;
		}

		.icon-wrapper {
			height: 18px;

			.nuxt-icon {
				margin-top: -2px;
				color: c(accent);
				font-size: 22px;
			}
		}

		.vertical & {
			@include radius-small;
			justify-content: flex-start;
			width: 100%;
			padding: 8px;

			.badge {
				width: 100%;
			}

			&.active {
				background-color: c(hover-color);
			}
		}
	}
</style>
