<script setup lang="ts">
	const props = defineProps<{
		clipped?: boolean;
		vertical?: boolean;
		state: IndicatorState;
		wrapperLength: number;
		left: number;
	}>();
</script>

<script lang="ts">
	export type IndicatorState = "hidden" | "normal" | "hover";
</script>

<template>
	<div class="wrapper" :style="{ '--length': wrapperLength + 'px', left: left + 'px' }">
		<div class="indicator" :class="{ clipped, vertical, hidden: state === 'hidden', hover: state === 'hover' }"></div>
	</div>
</template>

<style scoped lang="scss">
	$length: 20px;
	$hover-length: 40px;
	$thickness: 3px;

	.indicator {
		@include oval;
		flex-shrink: 0;
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

		&.hidden {
			width: 0;
		}

		&.hover {
			width: $hover-length;
		}
	}

	.wrapper {
		@include flex-center;
		--length: 2em;
		position: absolute;
		width: var(--length);
		height: $thickness;
		transition: $fallback-transitions, width $ease-out-max 250ms, height $ease-out-max 250ms, all $ease-out-max 500ms;

		&.vertical {
			width: $thickness;
			height: var(--length);
		}
	}
</style>
