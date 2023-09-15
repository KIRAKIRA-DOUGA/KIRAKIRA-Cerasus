<script setup lang="ts">
	const view = defineModel<ViewType>({ required: true });
</script>

<template>
	<Comp>
		<Subheader icon="grid">{{ t.view }}</Subheader>
		<Segmented v-model="view">
			<SegmentedItem id="list" icon="list">{{ t.view.list }}</SegmentedItem>
			<SegmentedItem id="grid" icon="grid">{{ t.view.grid }}</SegmentedItem>
			<SegmentedItem id="tile" icon="tile">{{ t.view.tile }}</SegmentedItem>
		</Segmented>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		display: contents;

		> * {
			width: inherit;
		}
	}
</style>
