<docs>
	进度环
	目前只可用于不确定的进度 (indeterminate)
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		show?: boolean;
		size?: number;
	}>(), {
		show: true,
		size: 28,
	});
</script>

<template>
	<Transition>
		<div v-if="show" class="spinner">
			<div class="layer">
				<div class="circle-clipper left">
					<div class="circle"></div>
				</div>
				<div class="gap-patch">
					<div class="circle"></div>
				</div>
				<div class="circle-clipper right">
					<div class="circle"></div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
	$layer-animation-options: cubic-bezier(0.4, 0, 0.2, 1) infinite both;

	.spinner {
		@include square(var(--size));
		--size: calc(v-bind(size) * 1px);
		--border-size: 3px;
		position: relative;
		display: inline-block;
		animation: spinner 1568ms linear infinite;

		&.v-enter-from,
		&.v-leave-to {
			--border-size: 0;
		}
	}

	@keyframes spinner {
		to {
			rotate: 1turn;
		}
	}

	.layer {
		@include square(100%);
		position: absolute;
		border-color: c(accent);
		opacity: 1;
		animation: layer-fill-unfill-rotate 5332ms $layer-animation-options;
	}

	@keyframes layer-fill-unfill-rotate {
		$length: 8;

		@for $i from 1 through 8 {
			#{calc(100% / $length) * $i} {
				rotate: calc(3turn / $length) * $i;
			}
		}
	}

	@keyframes layer-1-fade-in-out {
		0%,
		25%,
		90%,
		100% {
			opacity: 1;
		}

		26%,
		89% {
			opacity: 0;
		}
	}

	@keyframes layer-2-fade-in-out {
		0%,
		15%,
		51% {
			opacity: 0;
		}

		25%,
		50% {
			opacity: 1;
		}
	}

	@keyframes layer-3-fade-in-out {
		0%,
		40%,
		76% {
			opacity: 0;
		}

		50%,
		75% {
			opacity: 1;
		}
	}

	@keyframes layer-4-fade-in-out {
		0%,
		65%,
		100% {
			opacity: 0;
		}

		75%,
		90% {
			opacity: 1;
		}
	}

	.gap-patch {
		position: absolute;
		top: 0;
		left: 45%;
		width: 10%;
		height: 100%;
		overflow: hidden;
		border-color: inherit;

		.circle {
			left: -450%;
			box-sizing: border-box;
			width: 1000%;
		}
	}

	.circle-clipper {
		$circle-animation-options: 1333ms $layer-animation-options;

		position: relative;
		display: inline-block;
		width: 50%;
		height: 100%;
		overflow: hidden;
		border-color: inherit;

		.circle {
			@include circle;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			box-sizing: border-box;
			width: 200%;
			height: 100%;
			border-color: inherit;
			border-style: solid;
			border-width: var(--border-size);
			border-bottom-color: transparent !important;
			animation: none;

			&.v-enter-from,
			&.v-leave-to {
				border: 0 solid;
			}
		}

		&.left {
			float: left;

			.circle {
				left: 0;
				border-right-color: transparent !important;
				rotate: 129deg;
				animation: left-spin $circle-animation-options;
			}
		}

		&.right {
			float: right;

			.circle {
				left: -100%;
				border-left-color: transparent !important;
				rotate: -129deg;
				animation: right-spin $circle-animation-options;
			}
		}
	}

	@keyframes left-spin {
		0%,
		100% {
			rotate: 130deg;
		}

		50% {
			rotate: -5deg;
		}
	}

	@keyframes right-spin {
		0%,
		100% {
			rotate: -130deg;
		}

		50% {
			rotate: 5deg;
		}
	}
</style>
