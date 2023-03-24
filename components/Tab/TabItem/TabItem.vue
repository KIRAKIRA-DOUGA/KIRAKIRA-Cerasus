<script setup lang="ts">
	import TabBar from "../TabBar.vue";

	const props = defineProps<{
		id: string;
		vertical?: boolean;
	}>();

	const parent = useParent(TabBar)!;
	const active = computed(() => parent.props.modelValue === props.id);

	/**
	 * 单击切换选项卡事件。
	 */
	function onClick() {
		parent.exposed?.changeTab(props.id);
	}
</script>

<template>
	<div :class="{ active, vertical }" @click="onClick">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.active {
		color: c(accent);
		font-weight: bold;
	}

	.vertical {
		@include flex-center;
		flex-direction: column;
		gap: 2px;
	}
</style>
