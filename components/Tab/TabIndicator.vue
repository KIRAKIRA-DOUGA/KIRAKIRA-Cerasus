<!-- DELETE: 即将删除！ -->

<script lang="ts">
	export type IndicatorState = "hidden" | "normal" | "hover";
</script>

<script setup lang="ts">
	const props = defineProps<{
		clipped?: boolean;
		vertical?: boolean;
		state: IndicatorState;
		wrapperLength: number;
		left: number;
	}>();

	const indicator = ref<HTMLDivElement>();

	/**
	 * 重新播放指示器动画。
	 */
	function replayIndicatorAnimation() {
		if (!indicator.value) return;
		replayAnimation(indicator.value, "changing");
	}

	defineExpose({
		replayIndicatorAnimation,
	});
</script>

<template>
	<div class="wrapper" :style="{ '--length': wrapperLength + 'px', left: left + 'px' }">
		<div ref="indicator" class="indicator" :class="{ clipped, vertical, hidden: state === 'hidden', hover: state === 'hover' }"></div>
	</div>
</template>

<style scoped lang="scss">
	$length: 20px;
	$hover-length: 30px;
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

	:deep(.indicator.changing) {
		$animation-1-duration: 75ms;
		$animation-2-duration: 200ms;
		animation:
			indicator-change-1 $animation-1-duration $ease-out-sine,
			indicator-change-2 $animation-2-duration $animation-1-duration $ease-in-sine;
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

	@keyframes indicator-change-1 {
		from {
			width: $length;
		}

		to {
			width: $hover-length;
		}
	}

	@keyframes indicator-change-2 {
		from {
			width: $hover-length;
		}

		to {
			width: $length;
		}
	}
</style>
