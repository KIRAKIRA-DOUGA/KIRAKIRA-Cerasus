<script setup lang="ts">
	import { TabBarChildren } from "./Bar.vue";

	const props = defineProps<{
		id: string;
	}>();

	const dom = ref<HTMLDivElement>();
	const parent = getParent()!;
	const active = computed(() => parent.props.modelValue === props.id);

	function onClick() {
		parent.exposed?.changeTab(props.id);
	}

	onMounted(() => {
		parent.exposed!.children[props.id] = dom.value;
		if (!parent.exposed || !dom.value) return;
		const children = parent.exposed.children as TabBarChildren;
		children[props.id] = { dom: dom.value };
	});
</script>

<template>
	<div ref="dom" :class="{ active }" @click="onClick">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.active {
		color: c(accent);
		font-weight: bold;
	}
</style>
