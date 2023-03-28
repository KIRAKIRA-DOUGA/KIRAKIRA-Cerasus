<script setup lang="ts">
	import { useAVBars } from "vue-audio-visual";
	import audio0 from "assets/audios/test0.mp3";
	import audio1 from "assets/audios/test1.mp3";
	import audio2 from "assets/audios/test2.mp3";

	const audioPath = randomOne([audio0, audio1, audio2]);
	const player = ref<HTMLAudioElement>();
	const canvas = ref<HTMLCanvasElement>();
	const accent = useCssVar("--accent");
	const accent10 = useCssVar("--accent-10");
	const pitch = ref(0);

	useAVBars(player, canvas, {
		src: audioPath,
		canvHeight: 60,
		canvWidth: 200,
		barColor: [accent10.value, accent.value],
		barSpace: 0,
		barWidth: 2,
	});

	onMounted(() => {
		if (!player.value) return;
		player.value.preservesPitch = false;
	});

	/**
	 * 滑动滑动条完成后事件。
	 */
	function onSliding() {
		if (!player.value) return;
		player.value.playbackRate = 2 ** (pitch.value / 12);
	}
</script>

<template>
	<div class="container">
		<h2>测试音频与频谱功能</h2>
		<audio ref="player" :src="audioPath" controls />
		<Slider v-model="pitch" :min="-24" :max="24" :defaultValue="0" @changing="onSliding" />
		<canvas ref="canvas" />
	</div>
</template>

<style scoped lang="scss">
	h2 {
		margin-bottom: 1.5rem;
	}

	audio {
		width: 100%;
	}
</style>
