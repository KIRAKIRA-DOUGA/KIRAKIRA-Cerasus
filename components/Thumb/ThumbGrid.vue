<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 视图。 */
		view?: string;
	}>(), {
		view: "grid",
	});
</script>

<template>
	<Comp :class="view">
		<slot></slot>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		container: thumb-grid / inline-size;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(226px, 1fr));
		gap: 0;
		justify-content: space-between;
		align-items: start;
		margin: 0 -8px;

		@include mobile {
			grid-template-columns: repeat(2, 1fr);
		}

		&.list {
			grid-template-columns: 1fr;
		}

		&.tile {
			grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		}
	}
</style>
