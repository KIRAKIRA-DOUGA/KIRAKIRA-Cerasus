<script setup lang="ts">
	const view = defineModel<ViewType>({ required: true });
</script>

<template>
	<Segmented v-model="view" class="view-switch">
		<SegmentedItem id="list" icon="list">{{ $t("view.list") }}</SegmentedItem>
		<SegmentedItem id="grid" icon="grid">{{ $t("view.grid") }}</SegmentedItem>
		<SegmentedItem id="tile" icon="tile">{{ $t("view.tile") }}</SegmentedItem>
	</Segmented>
</template>

<style scoped lang="scss">
	.view-switch {
		width: calc(36px * 3);

		&:deep(.item) {
			@include square(36px);
			padding: 0;
		}

		&:deep(.item > span) {
			display: none;
		}

		&:deep(.item > .icon) {
			margin-left: 0;
		}
	}
</style>
