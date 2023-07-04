<script setup lang="ts">
	import AccordionItem from "./AccordionItem.vue";

	const props = defineProps<{
		/** 是否在打开其它手风琴项目时自动折叠已打开的手风琴项目？ */
		autoCollapse?: boolean;
	}>();

	defineSlots<{
		default?: typeof AccordionItem;
	}>();

	const { Slot, children } = useFactory(AccordionItem);

	/**
	 * 关闭所有手风琴项目。
	 */
	function collaspeAll() {
		if (!props.autoCollapse || !children.value) return;
		for (const child of children.value) {
			if (!child.component?.exposed?.shown) return;
			child.component.exposed.shown.value = false;
		}
	}

	defineExpose({
		collaspeAll,
	});
</script>

<template>
	<Comp role="list">
		<Slot />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include chip-shadow;
		background-color: c(main-bg, 50%);
	}
</style>
