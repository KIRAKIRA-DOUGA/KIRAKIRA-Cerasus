<script setup lang="ts">
	const props = withDefaults(defineProps<{
		size?: number;
	}>(), {
		size: 28,
	});
</script>

<template>
	<svg class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
		<circle
			class="circle"
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
	.spinner {
		animation: rotation 1.35s linear infinite;
		stroke: c(accent);
		--size: calc(v-bind(size) * 1px);
		width: var(--size);
		height: var(--size);
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(270deg);
		}
	}

	.circle {
		stroke-dasharray: 180;
		stroke-dashoffset: 0;
		transform-origin: center;
		animation: turn 1.35s ease-in-out infinite;
	}

	@keyframes turn {
		0% {
			stroke-dashoffset: 180;
		}

		50% {
			stroke-dashoffset: 45;
			transform: rotate(135deg);
		}

		100% {
			stroke-dashoffset: 180;
			transform: rotate(450deg);
		}
	}
</style>
