<script setup lang="ts">
	import TabItem from "./Item.vue";

	const props = defineProps<{
		clipped?: boolean;
		vertical?: boolean;
	}>();

	const slots = useSlots().default?.();
	if (slots)
		for (const comp of slots)
			if (comp.type !== TabItem)
				throw typeError;

	function changeTab(index: number) {

	}
</script>

<script lang="ts">
	export const typeError = new TypeError("TabBar 的插槽中只能包含 TabItem 组件。");
</script>

<template>
	<div class="tab-bar">
		<div class="items" :class="{ vertical }">
			<slot></slot>
		</div>
		<TabIndicator :clipped="clipped" :vertical="vertical" />
	</div>
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
</style>
