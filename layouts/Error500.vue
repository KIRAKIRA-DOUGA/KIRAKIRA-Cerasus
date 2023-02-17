<script setup lang="ts">
	import { httpResponseStatusCodes } from "helpers/http-status";
	import siliceous from "assets/videos/groove_battle.mp4";

	const props = defineProps<{
		statusCode: number | string;
		message: string;
		stack: string;
	}>();

	const title = computed(() => httpResponseStatusCodes[props.statusCode]);
	const video = ref<HTMLVideoElement>();
	const isPlaying = ref(false);
	const is500 = computed(() => +props.statusCode === 500);

	onMounted(() => {
		const playVideo = () => {
			if (!video.value) return;
			window.removeEventListener("click", playVideo);
			video.value.play();
		};
		window.addEventListener("click", playVideo);
	});

	/**
	 * 播放电摇嘲讽视频。
	 */
	function playVideo() {
		if (!video.value || isPlaying.value) return;
		isPlaying.value = true;
		video.value.play();
	}
</script>

<template>
	<div class="container">
		<div class="card" @click="playVideo">
			<div class="stack">
				<h2>{{ message }}</h2>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<pre v-html="stack"></pre>
			</div>
			<div class="card-bottom">
				<div class="bottom-left">
					<LogoLuXun v-show="!isPlaying" class="qrcode" />
					<video v-show="isPlaying" ref="video" :src="siliceous" class="siliceous" @pause="isPlaying = false"></video>
					<div class="title">
						<h1>{{ statusCode }}</h1>
						<p>{{ title }}</p>
					</div>
				</div>
				<div v-if="is500" class="fix-bug">又有bug了，赶紧给老娘修！</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.container {
		height: var(--inner-height);
		padding: 3.5rem 2.5rem;
	}

	.card {
		@include radius-large;
		@include card-shadow;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		overflow: hidden;
		animation: intro 600ms $ease-out-smooth;

		> * {
			animation: float-up 500ms calc(var(--i) * 100ms) $ease-out-expo backwards;
		}

		.card-bottom {
			@include radius-large;
			@include card-shadow;
			--i: 2;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			padding: 50px 60px;

			.bottom-left {
				display: flex;
				gap: 35px;
			}

			.title {
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;

				* {
					margin: 0;
					font-family: $english-logo-fonts;
				}

				h1 {
					font-size: 80px;
				}

				p {
					font-size: 20px;
				}
			}

			.fix-bug {
				flex-shrink: 100;
				font-size: 32px;
			}

			.qrcode,
			.siliceous {
				@include square(156px);
			}

			.siliceous {
				// mix-blend-mode: multiply; // TODO: 疑似在开启 mix-blend-mode 后显卡裁切区域会出现异常。

				.dark & {
					filter: invert(1);
					// mix-blend-mode: lighten;
				}
			}
		}

		.stack {
			--i: 1;
			display: flex;
			flex-direction: column;
			gap: 20px;
			padding: 40px 60px;
			overflow: auto;

			:deep(*) {
				margin: 0;
				font-family: $monospace-fonts !important;
				user-select: text;
			}

			pre {
				color: c(icon-color);
			}
		}
	}

	@keyframes intro {
		from {
			scale: 1.1;
			opacity: 0;
		}
	}

	@keyframes float-up {
		from {
			opacity: 0;
			translate: 0 50px;
		}
	}
</style>
