<script setup lang="ts">
	const props = withDefaults(defineProps<{
		width?: number;
		height?: number;
	}>(), {
		width: 400,
		height: 400,
	});
</script>

<template>
	<div class="cover">
		<div class="lines">
			<div v-for="i in 5" :key="`line-${i}`"></div>
		</div>
		<div class="pluses">
			<div v-for="i in 4" :key="`plus-${i}`">
				<span v-for="j in 4" :key="`plus-${i}-${j}`" v-i="i + j - 2">
					+
				</span>
			</div>
		</div>
		<div class="triangle triangle-1">
			<svg height="70" width="60">
				<polygon points="4,4 4,66 56,35" />
			</svg>
		</div>
		<div class="triangle triangle-2"></div>
		<div class="title">KiRAKiRA☆</div>
		<div class="circle circle-1"></div>
		<div class="circle circle-2">
			<div v-for="i in 13" :key="`circle-line-${i}`"></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.title {
		font-weight: 600;
		font-size: 3.5rem;
		animation: blinking 2s infinite ease-in alternate;
	}

	.cover {
		@include flex-center;
		--cover-width: calc(v-bind(width) * 1px); // v-bind 基于运行时，因此没办法赋值给 scss 变量。
		--cover-height: calc(v-bind(height) * 1px);
		position: relative;
		width: var(--cover-width);
		height: var(--cover-height);
		overflow: hidden;
		color: c(accent);
		user-select: none !important;

		> * {
			position: absolute;
		}

		* {
			font-family: $english-logo-fonts;
		}
	}

	.lines {
		width: 100%;
		height: 100%;
		transform: rotate(-32deg);

		* {
			@include oval;
			--height: 1rem;
			--from: 100%;
			--to: -100%;
			position: absolute;
			width: calc(var(--height) * 15);
			height: var(--height);
			background-color: c(accent-20);
			animation: movement 4s infinite linear;
		}

		:nth-child(1) {
			--height: 2rem;
			top: -2rem;
			animation-duration: 8s;
		}

		:nth-child(2) {
			--height: 1rem;
			--from: 300%;
			top: 30%;
			animation-duration: 16s;
		}

		:nth-child(3) {
			--height: 0.5rem;
			--from: 550%;
			--to: -200%;
			top: 55%;
			animation-duration: 32s;
		}

		:nth-child(4) {
			--height: 2rem;
			--from: 150%;
			--to: -150%;
			top: 58%;
			animation-duration: 8s;
		}

		:nth-child(5) {
			--height: 4rem;
			bottom: 0;
			animation-duration: 6s;
		}
	}

	.pluses {
		right: 0;
		bottom: 0.25rem;
		font-weight: 300;
		font-size: 2rem;

		span {
			display: inline-block;
			margin: 0 1rem;
			animation: plus-rotation 4s ease-in-out calc(var(--i) * 0.25s) infinite;
		}
	}

	.triangle {
		--length: 5rem;
		width: calc(var(--length) / 2 * 1.732);
		height: var(--length);
		background-color: c(accent);
		animation: triangle-movement 4s cubic-bezier(0, 0.5, 1, 0.5) infinite, triangle-blinking 2s cubic-bezier(0, 0, 0, 1) infinite alternate;
		clip-path: polygon(0 0, 100% 50%, 0 100%);
	}

	.triangle-1 {
		right: calc(var(--cover-width) - 40%);
		bottom: 2rem;
		background-color: transparent;
		animation-delay: -1s;
		clip-path: none;

		svg polygon {
			fill: transparent;
			stroke: c(accent);
			stroke-width: 2px;
		}
	}

	.triangle-2 {
		--length: 2rem;
		right: 4rem;
		bottom: 36%;
	}

	.circle {
		@include square(8rem);
		@include circle;
		overflow: hidden;
	}

	.circle-1 {
		top: 15%;
		right: -3rem;
		border: c(accent) 2px solid;
		animation: circle-scaling 4s cubic-bezier(0, 0, 0, 1) infinite alternate;
	}

	.circle-2 {
		--cover-size: 12rem;
		right: calc(var(--cover-size) + 5rem);
		bottom: -3rem;
		animation: rotation 16s linear infinite;

		> * {
			width: 100%;
			height: 1rem;
			background-color: c(accent);
			animation: shades 2s ease-in-out infinite alternate;
		}
	}

	@keyframes movement {
		from {
			transform: translate(var(--from));
		}

		to {
			transform: translate(var(--to));
		}
	}

	@keyframes blinking {
		from {
			opacity: 1;
		}

		to {
			opacity: 0.5;
		}
	}

	@keyframes plus-rotation {
		0% {
			transform: rotateY(-360deg);
		}

		50%,
		100% {
			transform: rotateY(0);
		}
	}

	@keyframes triangle-movement {
		from {
			transform: translate(-5rem);
		}

		to {
			transform: translate(5rem);
		}
	}

	@keyframes triangle-blinking {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes circle-scaling {
		from {
			border-width: 1rem;
			transform: scale(0);
		}

		to {
			border-width: 2px;
			transform: none;
		}
	}

	@keyframes rotation {
		from {
			transform: rotate(0);
		}

		to {
			transform: rotate(360deg);
		}
	}

	@keyframes shades {
		from {
			transform: scaleY(0.7);
		}

		to {
			transform: scaleY(0.3);
		}
	}
</style>
