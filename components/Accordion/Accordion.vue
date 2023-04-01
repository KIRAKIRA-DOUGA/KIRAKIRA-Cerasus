<script setup lang="ts">
	import AccordionItem from "./AccordionItem.vue";

	const props = defineProps<{
		autoCollapse?: boolean;
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
	<Comp>
		<Slot />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include radius-large;
		@include chip-shadow;
		background-color: c(main-bg, 50%);
	}
</style>
