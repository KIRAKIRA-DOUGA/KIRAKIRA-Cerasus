<script setup lang="ts">
	import TabBar, { typeError } from "./Bar.vue";

	const props = defineProps<{
		id: string;
	}>();

	const dom = ref<HTMLDivElement>();
	const parent = getParent()!;

	if (parent?.type !== TabBar)
		throw typeError;

	function onClick() {
		parent.exposed?.changeTab(props.id);
	}

	defineExpose({
		dom,
	});
</script>

<template>
	<div ref="dom" @click="onClick">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">

</style>
