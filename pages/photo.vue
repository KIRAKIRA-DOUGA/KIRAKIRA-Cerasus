<script setup lang="ts">
	import testPhoto from "assets/images/palettes/pink.webp";
	import shibamata from "assets/audios/shibamata.mp3";
	const audio = ref<HTMLAudioElement>();

	const audioContext = environment.client as true && new AudioContext();
	const audioData = ref<AudioBuffer>(), srcNode = ref<AudioBufferSourceNode | null>(null);

	// Load some audio (CORS need to be allowed or we won't be able to decode the data)
	fetch(shibamata, { mode: "cors" }).then(response => response.arrayBuffer()).then(decode);

	/**
	 * Decode the audio file, then start the show.
	 * @param buffer - Audio file buffer.
	 */
	function decode(buffer: ArrayBuffer) {
		audioContext.decodeAudioData(buffer, playLoop);
	}

	/**
	 * Sets up a new source node as needed as stopping will render current invalid
	 * @param buffer - Audio file buffer.
	 */
	function playLoop(buffer: AudioBuffer) {
		if (!audioData.value) audioData.value = buffer;
		srcNode.value = audioContext.createBufferSource();
		srcNode.value.buffer = buffer;
		srcNode.value.connect(audioContext.destination);
		srcNode.value.loop = true;
		srcNode.value.start();
	}

	/**
	 * 一键柴又！
	 */
	function otomading() {
		// if (!audio.value) return;
		// const { paused } = audio.value;
		// if (paused) audio.value.play();
		// else audio.value.pause();
		if (srcNode.value) {
			srcNode.value.stop();
			srcNode.value = null;
		} else
			playLoop(audioData.value!);
	}
</script>

<template>
	<div class="container">
		<h2>测试相簿功能</h2>
		<Button @click="otomading">音MADing!</Button>
		<video ref="audio" loop controls>
			<source :src="shibamata" />
		</video>
		<img :src="testPhoto" alt="photo" />
	</div>
</template>
