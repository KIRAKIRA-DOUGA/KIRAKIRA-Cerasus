<docs>
	# 横向进度条
	目前仅可用于不确定的进度 (indeterminate)。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 加载完成并隐藏？ */
		hidden?: boolean;
	}>();
</script>

<template>
	<Transition :duration="250">
		<Comp v-if="!hidden">
			<div class="wrapper">
				<div class="line-wrapper line-wrapper-1">
					<div class="line line-1"></div>
				</div>
				<div class="line-wrapper line-wrapper-2">
					<div class="line line-2"></div>
				</div>
			</div>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	$animation-options: 2s infinite linear;

	:comp {
		@include oval;
		position: relative;
		height: 4px;
		overflow: hidden;

		&.v-enter-from,
		&.v-leave-to {
			scale: 1 0;
		}
	}

	.wrapper {
		height: 100%;
		background-color: c(gray-30);
		transition: transform 1s $ease-out-smooth;

		.line-wrapper {
			@include square(100%);
			position: absolute;
			transform-origin: top left;

			&.line-wrapper-1 {
				left: -145.1666%;
				animation: indeterminate-move-1 $animation-options;
			}

			&.line-wrapper-2 {
				left: -54.8889%;
				animation: indeterminate-move-2 $animation-options;
			}
		}

		.line {
			@include square(100%);
			@include oval;
			position: absolute;
			display: inline-block;
			background-color: c(accent);

			&.line-1 {
				animation: indeterminate-scale-1 $animation-options;
			}

			&.line-2 {
				animation: indeterminate-scale-2 $animation-options;
			}
		}
	}

	@keyframes indeterminate-move-1 {
		0% {
			translate: 0;
		}

		20% {
			translate: 0;
			animation-timing-function: cubic-bezier(0.5, 0, 0.7017, 0.4958);
		}

		59.15% {
			translate: 83.6714%;
			animation-timing-function: cubic-bezier(0.3024, 0.3814, 0.55, 0.9563);
		}

		100% {
			translate: 200.6111%;
		}
	}

	@keyframes indeterminate-move-2 {
		0% {
			translate: 0;
			animation-timing-function: cubic-bezier(0.15, 0, 0.5151, 0.4097);
		}

		25% {
			translate: 37.6519%;
			animation-timing-function: cubic-bezier(0.3103, 0.2841, 0.8, 0.7337);
		}

		48.35% {
			translate: 84.3862%;
			animation-timing-function: cubic-bezier(0.4, 0.627, 0.6, 0.902);
		}

		100% {
			translate: 160.2778%;
		}
	}

	@keyframes indeterminate-scale-1 {
		0%,
		100% {
			scale: 0.08 1;
		}

		36.65% {
			scale: 0.08 1;
			animation-timing-function: cubic-bezier(0.3347, 0.1248, 0.7858, 1);
		}

		69.15% {
			scale: 0.6615 1;
			animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
		}
	}

	@keyframes indeterminate-scale-2 {
		0% {
			scale: 0.08 1;
			animation-timing-function: cubic-bezier(0.205, 0.0571, 0.5766, 0.454);
		}

		19.15% {
			scale: 0.4571 1;
			animation-timing-function: cubic-bezier(0.1523, 0.1964, 0.6484, 1.0043);
		}

		44.15% {
			scale: 0.728 1;
			animation-timing-function: cubic-bezier(0.2578, -0.0032, 0.2118, 1.3818);
		}

		100% {
			scale: 0.08 1;
		}
	}
</style>
