<script setup lang="ts">
	const props = defineProps<{
		clipped?: boolean;
		vertical?: boolean;
	}>();
</script>

<template>
	<div class="indicator" :class="{ clipped, vertical }"></div>
</template>

<style scoped lang="scss">
	$length: 20px;
	$thickness: 3px;

	.indicator {
		@include oval;
		width: $length;
		height: $thickness;
		background-color: c(accent);

		&.clipped:not(.vertical) {
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
		}

		&.vertical {
			width: $thickness;
			height: $length;

			&.clipped {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
		}
	}
</style>
