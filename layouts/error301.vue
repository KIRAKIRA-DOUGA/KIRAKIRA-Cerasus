<script setup lang="ts">
	import music from "assets/audios/全都是你的所作所为.aac";

	const props = withDefaults(defineProps<{
		/** 错误原因。 */
		message?: string;
	}>(), {
		// TODO: 后续的视频删除原因可能需要在数据库进行记录（官方删除可能性？）
		message: "该视频被万恶的创作者给削除了",
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
	<!-- <div class="foreground">
		<h1>啊？不见了‽</h1>
		<h2>{{ message }}</h2>
		<Button href="/">{{ t.navigation.return_to_home }}</Button>
	</div> -->
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

	.ellipsis-container {
		@include square(50dvmin);
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
			$step: 5;
			$distance: 10px;

			@for $j from 0 through calc(100 / $step) {
				#{$j * $step}% {
					$offset: math.random() * 2 - 1;
					translate: $offset * $distance;
				}
			}
		}
	}

	@property --box-shadow-spread {
		syntax: "<length>";
		inherits: false;
		initial-value: 0;
	}
</style>
