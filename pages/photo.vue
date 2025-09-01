<script setup lang="ts">
	import shibamata from "assets/audios/shibamata.mp3";
	import metadata from "assets/audios/shibamata.vtt";
	import testPhoto from "assets/images/かいりきベア.jpg";
	const audio = ref<HTMLAudioElement>();
	const currentPitch = ref("");
	const flipped = ref<boolean>();
	const photoInput = ref<HTMLInputElement>();
	const photo = ref(testPhoto);
	const cueChangeTimeoutId = ref<Timeout>();
	const pitch = ref(0);
	const rate = computed({
		get: () => 2 ** (pitch.value / 12),
		set: value => pitch.value = Math.log2(value) * 12,
	});
	const enter = ref(true);

	/**
	 * 一键柴又！
	 */
	function otomading() {
		if (!audio.value) return;
		audio.value.preservesPitch = false;
		const { paused } = audio.value;
		if (paused) audio.value.play().catch(useNoop);
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
		cueChangeTimeoutId.value = setTimeout(() => currentPitch.value = "", duration / rate.value);
		currentPitch.value = cue.text;
		flipped.value = !flipped.value;
	}

	/**
	 * 在上传图片时调用。
	 * @param e - 普通事件。
	 */
	async function onChangePhoto(e: Event) {
		const input = e.target as HTMLInputElement;
		const image = input.files?.[0];
		if (image)
			photo.value = await fileToBlob(image);
	}

	/**
	 * 点击图片更换图片。
	 * @param e - 普通事件。
	 */
	function onClickPhoto(e: Event) {
		replayAnimation(e.currentTarget as HTMLDivElement, "swing");
		photoInput.value?.click();
	}

	/**
	 * 滑动滑动条完成后事件。
	 */
	function onSliding() {
		if (!audio.value) return;
		audio.value.playbackRate = rate.value;
	}

	/**
	 * 当音频改变播放速度事件。
	 * @param e - 普通事件。
	 */
	function onRateChange(e: Event) {
		const audio = e.currentTarget as HTMLAudioElement;
		rate.value = audio.playbackRate;
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
			<ToggleSwitch v-model="enter">进入</ToggleSwitch>
			<Slider v-model="pitch" :min="-24" :max="24" :defaultValue="0" @changing="onSliding" />
			<audio ref="audio" loop controls @ratechange="onRateChange">
				<source :src="shibamata" />
				<track default kind="metadata" :src="metadata" @cuechange="onCueChange" />
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
			<img
				:src="photo"
				alt="photo"
				:class="{ front: flipped === false, back: flipped, enter }"
				:tabindex="0"
			/>
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
			margin-bottom: auto;
			font-size: 54px;
			text-align: center;

			&:empty::after {
				content: "\a0"; // 当无内容时，依然保持高度占位防止布局跳动。
			}
		}

		video,
		audio {
			@include mobile {
				width: 100%;
			}
		}
	}

	.right {
		overflow: clip;
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

			&:focus-visible {
				filter: invert(1);
			}

			&:not(.enter) {
				animation-timing-function: step-start;
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
