<script setup lang="ts">
	import Indicator, { IndicatorState } from "./Indicator.vue";
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

	const childDoms = reactive({} as Record<string, HTMLElement>);
	const tabBar = ref<HTMLElement>();
	const indicatorState = ref<IndicatorState>("hidden");
	const indicatorWrapperLength = ref(28);
	const indicatorLeft = ref(0);
	// @ts-ignore
	const indicator = ref<InstanceType<typeof Indicator>>();

	function changeTab(id: string) {
		emits("update:modelValue", id);
	}

	function updateIndicator(id: string) {
		const item = childDoms[id];
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
	});

	defineExpose({
		changeTab,
		childDoms,
	});
</script>

<script lang="ts">
	export const typeError = new TypeError("TabBar 的插槽中只能包含 TabItem 组件。");
</script>

<template>
	<section ref="tabBar">
		<div class="items" :class="{ vertical }">
			<slot></slot>
		</div>
		<TabIndicator
			ref="indicator"
			:clipped="clipped"
			:vertical="vertical"
			:state="indicatorState"
			:wrapperLength="indicatorWrapperLength"
			:left="indicatorLeft"
		/>
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
</style>
