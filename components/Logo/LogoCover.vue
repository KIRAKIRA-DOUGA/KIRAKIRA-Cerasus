<script setup lang="ts">
	import { vElementSize } from "@vueuse/components";

	const props = defineProps<{
		/** 如是则将 LOGO 切换为 Welcome 字样。 */
		welcome?: boolean;
		/** 是否**禁用**动画以节省性能？ */
		noAnimation?: boolean;
		/** 如是则禁止显示标题。 */
		noTitle?: boolean;
	}>();

	const linesWidth = ref("400px");

	/**
	 * 处理元素大小变化。
	 * @param width - 宽度。
	 */
	function onResize({ width }: { width: number }) {
		linesWidth.value = width + "px";
	}
</script>

<template>
	<Comp :class="{ animation: !noAnimation }" role="img">
		<div class="lines" v-element-size="onResize">
			<div v-for="i in 5" :key="i"></div>
		</div>
		<div class="pluses">
			<div v-for="i in 4" :key="i">
				<span v-for="j in 4" :key="j" v-i="i + j - 2">
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
		<div v-if="!noTitle" class="titles" :class="{ welcome }">
			<div class="title welcome">Welcome</div>
			<LogoText class="title kirakira" />
		</div>
		<div class="circle circle-1"></div>
		<div class="circle circle-2">
			<div v-for="i in 13" :key="i"></div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 封面宽度。
			--width: 400px; // v-bind 基于运行时，因此没办法赋值给 scss 变量。
			/// 封面高度。
			--height: 400px;
			/// 如是则使用完全形式的 LOGO。
			--full-logo: false;
		}
	}

	.logo-text {
		--form: half;
	}

	@container style(--full-logo: true) {
		.logo-text {
			--form: full;
		}
	}

	.titles {
		position: relative;
		width: 100%;
		height: 70px;
		overflow: clip;

		:comp.animation & {
			animation: blinking 2s infinite ease-in alternate;
		}
	}

	.title {
		@include absolute-center;
		$move-distance: 4rem;
		font-size: 1.5rem;
		font-weight: 600;
		font-feature-settings: normal;
		text-transform: uppercase;
		scale: 2.5;
		transition: all $ease-out-smooth 800ms;

		.titles:not(.welcome) > &.welcome {
			margin-top: $move-distance;
		}

		.titles.welcome > &.kirakira {
			margin-top: -$move-distance;
		}
	}

	:comp {
		@include flex-center;
		position: relative;
		width: var(--width);
		height: var(--height);
		overflow: clip;
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
			--line-height: 1rem;
			--from: 100%;
			--to: calc((v-bind("linesWidth") + 100%) * -1);
			position: absolute;
			right: 0;
			width: calc(var(--line-height) * 15);
			height: var(--line-height);
			background-color: c(accent, 30%);

			:comp.animation :where(&) {
				animation: movement 4s infinite linear;
			}
		}

		:nth-child(1) {
			--line-height: 2rem;
			top: -2rem;
			animation-duration: 8s;
		}

		:nth-child(2) {
			--line-height: 1rem;
			--from: 300%;
			top: 30%;
			animation-duration: 16s;
		}

		:nth-child(3) {
			--line-height: 0.5rem;
			--from: 550%;
			--to: calc((v-bind("linesWidth") + 200%) * -1);
			top: 55%;
			animation-duration: 32s;
		}

		:nth-child(4) {
			--line-height: 1.5rem;
			--from: 150%;
			--to: calc((v-bind("linesWidth") + 150%) * -1);
			top: 58%;
			animation-duration: 12s;
		}

		:nth-child(5) {
			--line-height: 4rem;
			bottom: 0;
			animation-duration: 6s;
		}
	}

	.pluses {
		right: 0;
		bottom: 0.25rem;
		font-size: 2rem;
		font-weight: 300;

		> * {
			white-space: nowrap;
		}

		span {
			display: inline-block;
			margin: 0 1rem;

			:comp.animation & {
				animation: plus-rotation 4s ease-in-out calc(var(--i) * 0.25s) infinite;
			}
		}
	}

	.triangle {
		--length: 5rem;
		width: calc(var(--length) / 2 * 1.732);
		height: var(--length);
		background-color: c(accent);
		clip-path: polygon(0 0, 100% 50%, 0 100%);

		:comp.animation & {
			animation: movement 4s cubic-bezier(0, 0.5, 1, 0.5) infinite, triangle-blinking 2s cubic-bezier(0, 0, 0, 1) infinite alternate;
		}
	}

	.triangle-1 {
		right: calc(var(--width) - 40%);
		bottom: 2rem;
		background-color: transparent;
		clip-path: none;
		animation-delay: -1s;

		svg polygon {
			fill: transparent;
			stroke: c(accent);
			stroke-width: 2px;
		}

		:comp.animation & {
			--from: -5rem;
			--to: 20rem;
		}
	}

	.triangle-2 {
		--length: 2rem;
		right: 4rem;
		bottom: 36%;

		:comp.animation & {
			--from: -5rem;
			--to: 5rem;
		}
	}

	.circle {
		@include square(8rem);
		@include circle;
		overflow: clip;
	}

	.circle-1 {
		top: 15%;
		right: -3rem;
		border: c(accent) 2px solid;

		:comp.animation & {
			animation: circle-scaling 4s cubic-bezier(0, 0, 0, 1) infinite alternate;
		}
	}

	.circle-2 {
		--cover-size: 12rem;
		right: calc(var(--cover-size) + 5rem);
		bottom: -3rem;

		:comp.animation & {
			animation: rotation 16s linear infinite;
		}

		> * {
			width: 100%;
			height: 1rem;
			background-color: c(accent);

			:comp.animation & {
				animation: shades 2s ease-in-out infinite alternate;
			}
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
			transform: rotateY(-1turn);
		}

		50%,
		100% {
			transform: rotateY(0);
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

	@keyframes shades {
		from {
			transform: scaleY(0.7);
		}

		to {
			transform: scaleY(0.3);
		}
	}
</style>
