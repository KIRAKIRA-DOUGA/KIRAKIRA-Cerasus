<script setup lang="ts">
	const props = defineProps<{
		autoCollapse?: boolean;
	}>();

	const slots = useSlots().default?.();
	const instance = getCurrentInstance();

	/**
	 * 关闭所有手风琴项目。
	 */
	function collaspeAll() {
		console.log(slots); // TODO: [兰音] 等待冰淤提供更好的方案。
		console.log(instance);
	}

	defineExpose({
		collaspeAll,
	});
</script>

<template>
	<kira-component class="accordion">
		<slot></slot>
	</kira-component>
</template>

<style scoped lang="scss">
	.accordion {
		@include radius-large;
		@include chip-shadow;
		background-color: c(main-bg, 50%);
	}
</style>
