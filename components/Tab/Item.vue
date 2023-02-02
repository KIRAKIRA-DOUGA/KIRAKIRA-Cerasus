<script setup lang="ts">
	const props = defineProps<{
		id: string;
	}>();

	const dom = ref<HTMLDivElement>();
	const parent = getParent()!;

	function onClick() {
		parent.exposed?.changeTab(props.id);
	}

	onMounted(() => {
		parent.exposed!.childDoms[props.id] = dom.value;
		if (!parent.exposed || !dom.value) return;
		const childDoms = parent.exposed.childDoms as Record<string, HTMLElement>;
		childDoms[props.id] = dom.value;
	});
</script>

<template>
	<div ref="dom" @click="onClick">
		<slot></slot>
	</div>
</template>
