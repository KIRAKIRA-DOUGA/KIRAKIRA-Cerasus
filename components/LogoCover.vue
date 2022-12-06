<script setup lang="ts">
	const _props = withDefaults(defineProps<{
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
				<span v-for="j in 4" :key="`plus-${i}-${j}`" :style="{ '--i': i + j - 2 }">
					+
				</span>
			</div>
		</div>
		<div class="triangle triangle1"></div> <!-- TODO: CSS 怎么做仅有边框的三角形啊啊啊啊。 -->
		<div class="triangle triangle2"></div>
		<div class="title">KiRAKiRA☆</div>
		<div class="circle circle1"></div>
		<div class="circle circle2">
			<div v-for="i in 13" :key="`circle-line-${i}`"></div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.title {
		font-size: 3.5rem;
		animation: blinking 2s infinite ease-in alternate;
		font-weight: 600;
	}

	.cover {
		--cover-width: calc(v-bind(width) * 1px); // v-bind 基于运行时，因此没办法赋值给 css 变量。
		--cover-height: calc(v-bind(height) * 1px);
		width: var(--cover-width);
		height: var(--cover-height);
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		color: $brand-pink-50;
		user-select: none !important;

		> * {
			position: absolute;
		}

		* {
			font-family: Montserrat, "Segoe UI", Arial, Helvetica, sans-serif;
		}
	}

	.lines {
		width: 100%;
		height: 100%;
		transform: rotate(-32deg);

		* {
			background-color: adjust-color($brand-pink-50, $alpha: -0.52);
			border-radius: 9999rem;
			--height: 1rem;
			width: calc(var(--height) * 15);
			height: var(--height);
			position: absolute;
			animation: movement 4s infinite linear;
			--from: 100%;
			--to: -100%;
		}

		:nth-child(1) {
			top: -2rem;
			--height: 2rem;
			animation-duration: 8s;
		}

		:nth-child(2) {
			top: 30%;
			--height: 1rem;
			--from: 300%;
			animation-duration: 16s;
		}

		:nth-child(3) {
			top: 55%;
			--height: 0.5rem;
			--from: 550%;
			--to: -200%;
			animation-duration: 32s;
		}

		:nth-child(4) {
			top: 58%;
			--height: 2rem;
			--from: 150%;
			--to: -150%;
			animation-duration: 8s;
		}

		:nth-child(5) {
			bottom: 0;
			--height: 4rem;
			animation-duration: 6s;
		}
	}

	.pluses {
		right: 0;
		bottom: 0.25rem;
		font-size: 2rem;
		font-weight: 300;

		span {
			margin: 0 1rem;
			animation: plus-rotation 4s ease-in-out calc(var(--i) * 0.25s) infinite;
			display: inline-block;
		}
	}

	.triangle {
		--length: 5rem;
		height: var(--length);
		width: calc(var(--length) / 2 * 1.732);
		background-color: $brand-pink-50;
		clip-path: polygon(0 0, 100% 50%, 0 100%);
		animation: triangle-movement 4s cubic-bezier(0, 0.5, 1, 0.5) infinite, triangle-blinking 2s cubic-bezier(0, 0, 0, 1) infinite alternate;
	}

	.triangle1 {
		bottom: 2rem;
		right: calc(var(--cover-width) - 40%);
		animation-delay: -1s;
	}

	.triangle2 {
		bottom: 36%;
		right: 4rem;
		--length: 2rem;
	}

	.circle {
		--cover-size: 8rem;
		width: var(--cover-size);
		height: var(--cover-size);
		border-radius: 100%;
		overflow: hidden;
	}

	.circle1 {
		right: -3rem;
		top: 15%;
		border: $brand-pink-50 2px solid;
		animation: circle-scaling 4s cubic-bezier(0, 0, 0, 1) infinite alternate;
	}

	.circle2 {
		--cover-size: 12rem;
		right: calc(var(--cover-size) + 5rem);
		bottom: -3rem;
		animation: rotation 16s linear infinite;

		> * {
			width: 100%;
			height: 1rem;
			background-color: $brand-pink-50;
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
			transform: scale(0);
			border-width: 1rem;
		}

		to {
			transform: none;
			border-width: 2px;
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
