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
	<div class="card" @click="playVideo">
		<div class="stack">
			<h2>{{ message }}</h2>
			<!-- eslint-disable-next-line vue/no-v-html -->
			<pre v-html="stack"></pre>
		</div>
		<div class="card-bottom">
			<div class="bottom-left">
				<LogoLuXun v-show="!isPlaying" />
				<video v-show="isPlaying" ref="video" :src="siliceous" class="siliceous" @pause="isPlaying = false"></video>
				<div class="title">
					<h1>{{ statusCode }}</h1>
					<p>{{ title }}</p>
				</div>
			</div>
			<div class="fix-bug">又有bug了，赶紧给老娘修！</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.card {
		@include radius-large;
		@include card-shadow;
		$margin-y: 3.5rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: calc(100vh - 2 * $margin-y);
		margin: $margin-y 2.5rem 0;
		overflow: hidden;
		animation: intro 600ms $ease-out-smooth;

		> * {
			animation: move-up 500ms $ease-out-expo;
		}

		.card-bottom {
			@include radius-large;
			@include card-shadow;
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
				font-size: 32px;
			}

			.siliceous {
				@include square(156px);
			}
		}

		.stack {
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

	@keyframes move-up {
		from {
			opacity: 0;
			translate: 0 100px;
		}
	}
</style>
