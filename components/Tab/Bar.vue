<script lang="ts">
	export const typeError = new TypeError("TabBar 的插槽中只能包含 TabItem 组件。");
	export type TabBarChildren = Record<string, {
		dom: HTMLElement;
	}>;
</script>

<script setup lang="ts">
	import TabItem from "./Item.vue";

	const props = defineProps<{
		clipped?: boolean;
		vertical?: boolean;
		modelValue: string;
	}>();

	const emits = defineEmits<{
		(event: "update:modelValue", arg: string): void;
	}>();

	const slots = useSlots().default?.();
	if (slots)
		for (const comp of slots)
			if (comp.type !== TabItem)
				throw typeError;

	const children = reactive({} as TabBarChildren);
	const tabBar = ref<HTMLElement>();

	function changeTab(id: string) {
		emits("update:modelValue", id);
	}

	function update(id: string) {
		"";
	}

	watch(() => props.modelValue, id => {
		update(id);
	});

	/* function updateIndicator(id: string) {
		const item = children[id];
		indicatorWrapperLength.value = item.clientWidth;
		let { left } = item.getClientRects()[0];
		left -= tabBar.value!.getClientRects()[0].left;
		indicatorLeft.value = left;
	}

	watch(() => props.modelValue, id => {
		updateIndicator(id);
		indicator.value?.replayIndicatorAnimation();
	});

	onMounted(() => {
		updateIndicator(props.modelValue);
		indicatorState.value = "normal";
	}); */

	defineExpose({
		changeTab,
		children,
	});
</script>

<template>
	<section ref="tabBar">
		<div class="items" :class="{ vertical }">
			<slot></slot>
		</div>
		<div class="indicator"></div>
	</section>
</template>

<style scoped lang="scss">
	.items {
		display: flex;
		gap: 1rem;
		align-items: flex-end;

		> :deep(*) {
			cursor: pointer;
		}
	}

	section {
		position: relative;
	}

	.indicator {
		@include oval;
		$thickness: 3px;
		flex-shrink: 0;
		width: 20px;
		height: $thickness;
		background-color: c(accent);
	}
</style>
