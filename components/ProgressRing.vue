<script setup lang="ts">
	const _props = withDefaults(defineProps<{
		size?: number;
	}>(), {
		size: 66,
	});
</script>

<template>
	<svg class="spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
		<circle
			class="path"
			fill="none"
			stroke-width="6"
			stroke-linecap="round"
			cx="33"
			cy="33"
			r="30"
		/>
	</svg>
</template>

<style scoped lang="scss">
	$offset: 187;
	$duration: 1.4s;

	.spinner {
		animation: rotator $duration linear infinite;
		zoom: calc(v-bind(size) / 65);
	}

	@keyframes rotator {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(270deg);
		}
	}

	.path {
		stroke-dasharray: $offset;
		stroke-dashoffset: 0;
		transform-origin: center;
		animation: dash $duration ease-in-out infinite;
		stroke: $brand-pink-50;
	}

	@keyframes dash {
		0% {
			stroke-dashoffset: $offset;
		}

		50% {
			stroke-dashoffset: calc($offset / 4);
			transform: rotate(135deg);
		}

		100% {
			stroke-dashoffset: $offset;
			transform: rotate(450deg);
		}
	}
</style>
