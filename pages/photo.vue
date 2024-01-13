<script setup lang="ts">
	import testPhoto from "assets/images/palettes/pink.webp";
	import shibamata from "assets/audios/shibamata.mp3";
	import metadata from "assets/audios/shibamata.vtt";
	const audio = ref<HTMLAudioElement>();
	const currentPitch = ref("");
	const flipped = ref<boolean>();
	const photoInput = ref<HTMLInputElement>();
	const photo = ref(testPhoto);
	const cueChangeTimeoutId = ref<Timeout>();

	/**
	 * 一键柴又！
	 */
	function otomading() {
		if (!audio.value) return;
		const { paused } = audio.value;
		if (paused) audio.value.play().catch(() => { });
		else {
			audio.value.pause();
			currentPitch.value = "";
			flipped.value = undefined;
		}
	}

	/**
	 * 字幕改变事件。
	 * @param e - 普通事件。
	 */
	function onCueChange(e: Event) {
		const track = e.target as HTMLTrackElement;
		const cue = track.track.activeCues?.[0] as VTTCue;
		if (!cue) return;
		clearTimeout(cueChangeTimeoutId.value);
		const duration = (cue.endTime - cue.startTime) * 1000;
		cueChangeTimeoutId.value = setTimeout(() => currentPitch.value = "", duration);
		currentPitch.value = cue.text;
		flipped.value = !flipped.value;
	}

	/**
	 * 在上传图片时调用。
	 * @param e - 普通事件。
	 */
	function onChangePhoto(e: Event) {
		const input = e.target as HTMLInputElement;
		const image = input.files?.[0];
		if (image)
			photo.value = fileToBlob(image);
	}

	/**
	 * 点击图片更换图片。
	 * @param e - 普通事件。
	 */
	function onClickPhoto(e: Event) {
		replayAnimation(e.currentTarget as HTMLDivElement, "swing");
		photoInput.value?.click();
	}

	onMounted(() => {
		otomading();
	});
</script>

<template>
	<div class="container">
		<div class="left">
			<h2>测试相簿功能</h2>
			<Button @click="otomading">音MADing!</Button>
			<p class="pitch">{{ currentPitch }}</p>
			<audio ref="audio" loop controls>
				<source :src="shibamata" />
				<track default kind="captions" :src="metadata" @cuechange="onCueChange" />
			</audio>
			<input
				ref="photoInput"
				hidden
				type="file"
				accept="image/*"
				@change="onChangePhoto"
			/>
		</div>
		<div class="right" @click="onClickPhoto">
			<img :src="photo" alt="photo" :class="{ front: flipped === false, back: flipped }" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$flip-scale: 1.1;

	.container,
	.left {
		display: flex;
		gap: 1.5rem;
		justify-content: space-between;
	}

	@include mobile {
		.container {
			flex-direction: column;
		}
	}

	.left {
		flex-direction: column;
		justify-content: flex-start;

		.pitch {
			font-size: 54px;
			text-align: center;
		}

		video,
		audio {
			margin-top: auto;
			
			@include mobile {
				width: 100%;
			}
		}
	}

	.right {
		overflow: hidden;
		cursor: pointer;

		&.swing {
			animation: swing 500ms $ease-out-sine;
		}

		img {
			width: 100%;
			max-height: calc(100dvh - 2 * 26px);

			&.front,
			&.back {
				animation: 250ms $ease-out-max forwards;
			}

			&.front {
				animation-name: flip-front;
			}

			&.back {
				animation-name: flip-back;
			}
		}
	}

	@keyframes flip-front {
		from {
			scale: $flip-scale;
		}

		to {
			scale: 1;
		}
	}

	@keyframes flip-back {
		from {
			scale: -$flip-scale $flip-scale;
		}

		to {
			scale: -1 1;
		}
	}
</style>
