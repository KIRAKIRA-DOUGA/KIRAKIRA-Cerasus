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
		display: grid;
		grid-gap: 0;
		grid-template-columns: repeat(auto-fill, minmax(226px, 1fr));
		align-items: start;
		justify-content: space-between;
		margin: 0 -8px;
		container: thumb-grid / inline-size;

		@include mobile {
			grid-template-columns: repeat(2, 1fr);
		}

		&.list {
			grid-template-columns: 1fr;
		}

		&.tile {
			grid-template-columns: repeat(auto-fill, minmax(342px, 1fr));
		}
	}
</style>
