<script setup lang="ts">
	const view = defineModel<ViewType>({ required: true });
</script>

<template>
	<Subheader icon="grid">视图</Subheader>
	<Segmented v-model="view">
		<SegmentedItem id="list" icon="list">列表</SegmentedItem>
		<SegmentedItem id="grid" icon="grid">网格</SegmentedItem>
		<SegmentedItem id="tile" icon="tile">磁贴</SegmentedItem>
	</Segmented>
</template>
