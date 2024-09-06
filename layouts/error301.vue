<script setup lang="ts">
	import { httpResponseStatusCodes } from "helpers/http-status";
	import music from "assets/audios/全都是你的所作所为.aac";

	const props = withDefaults(defineProps<{
		statusCode?: 301;
		/** 错误原因。 */
		message?: string;
	}>(), {
		statusCode: 301,
		// TODO: 后续的视频删除原因可能需要在数据库进行记录（官方删除可能性？）
		message: "该视频被万恶的创作者给削除了",
	});

	const message = computed(() => {
		const message = props.message.trim();
		return !message || message === httpResponseStatusCodes[301] ? "该视频被万恶的创作者给削除了" : message;
	});

	const musicEl = ref<HTMLAudioElement>();
	const playMusic = () => musicEl.value?.play().catch(useNoop);
	onMounted(() => playMusic());
	useEventListener("document", "click", () => playMusic());

	const INVERSE_BULLET_SIZE = 90;
	const inverseBulletMaskId = useId();
</script>

<template>
	<audio ref="musicEl" :src="music" loop></audio>
	<div class="background">
		<svg :width="INVERSE_BULLET_SIZE" :height="INVERSE_BULLET_SIZE" :viewBox="`0 0 ${INVERSE_BULLET_SIZE} ${INVERSE_BULLET_SIZE}`" class="inverse-bullet">
			<rect width="100%" height="100%" :mask="`url(#${inverseBulletMaskId})`" />
			<mask :id="inverseBulletMaskId">
				<rect width="100%" height="100%" fill="white" />
				<circle cx="50%" cy="50%" r="30%" fill="black" />
			</mask>
		</svg>
		<div class="strokes">
			<svg v-for="j in 2" :key="j">
				<rect v-for="i in 8" :key="i" />
			</svg>
		</div>
		<div class="ellipsis-container">
			<div class="ellipsis-container-relative">
				<div class="circle"></div>
				<div class="triangle triangle-up"></div>
				<div class="triangle triangle-down"></div>
				<!-- 原计划使用 JS 生成真随机故障效果，但是那样的话不支持 SSR，即服务端和客户端生成的随机数不可能一致。故改用 Sass 伪随机，即生成的动画实际上是周期变化的。 -->
				<section v-for="i in 3" :key="i" class="ellipsis">
					<div v-for="j in 3" :key="j" class="ellipsis-dot"></div>
				</section>
			</div>
		</div>
	</div>
	<div class="foreground">
		<div class="top">
			<h1>啊？不见了‽</h1>
		</div>
		<div class="ellipsis-container-shadow"></div>
		<div class="bottom">
			<h2>{{ message }}</h2>
			<Button href="/">{{ t.navigation.return_to_home }}</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
	$bpm: 132;
	$beat: calc(60s / $bpm);

	$inverse-bullet-initial-rotate: 55.55deg;

	.inverse-bullet {
		position: absolute;
		top: -5px;
		left: 87.5px;
		rotate: $inverse-bullet-initial-rotate;
		animation: inverse-bullet-rotation ($beat * 2) $ease-out-smooth infinite both;
		fill: c(accent-20);
	}

	%ellipsis-container-size {
		@include square(50dvmin);
	}

	.ellipsis-container {
		@extend %ellipsis-container-size;
		@include absolute-center(fixed);
		container: ellipsis-container / size;
		animation: ellipsis-container-emphasize $beat $ease-out-material-emphasized infinite forwards;

		.ellipsis-container-relative {
			@include square(100%);
			position: relative;
		}

		.circle {
			@include square(100%);
			@include circle;
			--box-shadow-spread: 1px;
			box-shadow: 0 0 0 var(--box-shadow-spread) c(accent-30) inset;
			animation: circle-thickness-change $beat $ease-out-smooth infinite forwards;
		}

		.triangle {
			$length: 14cqw;
			$margin: 13cqh;
			$color: c(accent-40);
			position: absolute;
			left: 50%;
			margin: 0 auto;
			transform: translateX(-50%);

			&.triangle-up {
				@include triangle($length, $color, up);
				top: $margin;
				animation: triangle-move-up ($beat * 2) $ease-out-material-emphasized infinite both;
			}

			&.triangle-down {
				@include triangle($length, $color, down);
				bottom: $margin;
				animation: triangle-move-down ($beat * 2) $ease-out-material-emphasized $beat infinite both;
			}
		}

		.ellipsis {
			@include absolute-center(absolute, false);
			$dot-size: 16cqh;
			display: flex;
			gap: 9cqw;
			translate: calc(var(--offset, 0) * 10px);

			.ellipsis-dot {
				@include square($dot-size);
				@include circle;
				background-color: c(accent);
			}

			&:nth-of-type(1) {
				clip-path: inset(0 0 calc(35 / 60 * 100%) 0);
			}

			&:nth-of-type(2) {
				clip-path: inset(calc(25 / 60 * 100%) 0 calc(15 / 60 * 100%) 0);
			}

			&:nth-of-type(3) {
				clip-path: inset(calc(44 / 60 * 100%) 0 0 0);
			}

			@for $i from 1 through 3 {
				&:nth-of-type(#{$i}) {
					animation: ellipsis-glitch-#{$i} 1s linear infinite;
				}
			}
		}
	}

	.ellipsis-container-shadow {
		@extend %ellipsis-container-size;
	}

	.strokes svg {
		$base-stroke-width: 50px;
		$base-animation-duration: 3s;
		$stroke-count: 8;
		position: fixed;
		width: 30lvw;
		height: 100lvh;
		overflow: visible;

		rect { // SVG line 元素暂时不支持使用 CSS 控制锚点，故改用 rect 元素代替之。
			width: 1px;
			height: var(--height);
			animation: stroke-scrolling $base-animation-duration linear infinite both;
			fill: none;
			stroke: c(accent);
			stroke-linecap: round;
			stroke-width: var(--stroke-width);
			x: 100%;
			y: 100px;
			rx: 1;
		}

		@for $side-index from 1 through 2 {
			&:nth-of-type(#{$side-index}) {
				#{if($side-index == 1, left, right)}: 10dvw;

				@for $i from 1 through $stroke-count {
					rect:nth-of-type(#{$i}) {
						// $depth: calc((rand-between(1, $stroke-count) - 1) / 2 + 1);
						$depth: calc(($stroke-count - $i) / 2 + 1);
						$transparency: map($depth, 1, calc($stroke-count / 2), 0.1, 0.6) * 100%;
						$reversed: math.random() <= 0.5;
						$height: calc(rand-between(100, 600) * 1px / $depth);
						$stroke-width: calc($base-stroke-width / $depth);
						--height: #{$height};
						--stroke-width: #{$stroke-width};
						animation-duration: $base-animation-duration * $depth;
						animation-delay: math.random() * (-$base-animation-duration);
						animation-direction: if(not $reversed, normal, reverse);
						stroke: color-mix(in oklab, c(accent-50), c(main-bg) $transparency);
						x: math.random() * 100%;

						@if $stroke-width * 7 <= $height * calc(3 / 4) and $i <= $stroke-count - 2 {
							$x: $stroke-width;
							$e: $stroke-width * 0.2;
							clip-path: if(
								not $reversed,
								polygon(
									0 0, 100% 0, 100% ($x + $e), 0 ($x + $e),
									0 ($x * 2 + $e), 100% ($x * 2 + $e), 100% ($x * 3 + $e), 0 ($x * 3 + $e),
									0 ($x * 4 + $e), 100% ($x * 4 + $e), 100% ($x * 5 + $e), 0 ($x * 5 + $e),
									0 ($x * 6 + $e), 100% ($x * 6 + $e), 100% 100%, 0 100%,
								),
								polygon(
									0 100%, 100% 100%, 100% calc(100% - ($x + $e)), 0 calc(100% - ($x + $e)),
									0 calc(100% - ($x * 2 + $e)), 100% calc(100% - ($x * 2 + $e)), 100% calc(100% - ($x * 3 + $e)), 0 calc(100% - ($x * 3 + $e)),
									0 calc(100% - ($x * 4 + $e)), 100% calc(100% - ($x * 4 + $e)), 100% calc(100% - ($x * 5 + $e)), 0 calc(100% - ($x * 5 + $e)),
									0 calc(100% - ($x * 6 + $e)), 100% calc(100% - ($x * 6 + $e)), 100% 0, 0 0,
								),
							);
						} @else {
							clip-path: none; // 防止 SSR 时样式被覆盖。
						}
					}
				}
			}
		}
	}

	.foreground {
		@include fullscreen;
		display: grid;
		grid-auto-rows: 1fr auto 1fr;
		gap: 50px;
		text-align: center;
		animation: breathe ($beat * 2) $ease-in-smooth alternate infinite backwards;

		.top,
		.bottom {
			display: flex;
			flex-direction: column;
			gap: 20px;
			align-items: center;

			> * {
				transition: $fallback-transitions, translate $ease-out-smooth 1s;
			}
		}

		.top {
			justify-content: flex-end;
		}

		h1 {
			color: c(accent);
			font-size: 5rem;
			font-weight: bold;

			@starting-style {
				translate: 0 -50px;
			}
		}

		h2 {
			color: c(icon-color);
			font-size: 1.25rem;
			font-weight: 300;

			@starting-style {
				translate: 0 50px;
			}
		}

		button {
			width: fit-content;

			@starting-style {
				translate: 0 100px;
			}
		}
	}

	@keyframes inverse-bullet-rotation {
		0% {
			rotate: $inverse-bullet-initial-rotate;
		}

		50% {
			rotate: $inverse-bullet-initial-rotate + 45deg;
		}

		100% {
			rotate: $inverse-bullet-initial-rotate + 90deg;
		}
	}

	@keyframes circle-thickness-change {
		from {
			--box-shadow-spread: 20px;
			scale: 1.025;
		}

		to {
			--box-shadow-spread: 1px;
			scale: 1;
		}
	}

	@each $direction in up, down {
		@keyframes triangle-move-#{$direction} {
			$movement: 12cqh;
			$movement-starting: if($direction == up, $movement, -$movement);

			0% {
				translate: 0 $movement-starting;
				opacity: 0;
			}

			50% {
				translate: 0;
				opacity: 1;
			}

			100% {
				translate: 0 (-$movement-starting);
				opacity: 0;
			}
		}
	}

	@keyframes ellipsis-container-emphasize {
		from {
			scale: 1.35;
		}

		to {
			scale: 1;
		}
	}

	@for $i from 1 through 3 {
		@keyframes ellipsis-glitch-#{$i} {
			$step: 2.5;
			$distance: 10px;

			@for $j from 0 through calc(100 / $step) {
				#{$j * $step}% {
					$offset: math.random() * 2 - 1;
					translate: $offset * $distance;
				}
			}
		}
	}

	@keyframes stroke-scrolling {
		from {
			y: calc(100% + var(--stroke-width) / 2);
		}

		to {
			y: calc(0% - var(--height) - var(--stroke-width) / 2);
		}
	}

	@property --box-shadow-spread {
		syntax: "<length>";
		inherits: false;
		initial-value: 0;
	}
</style>
