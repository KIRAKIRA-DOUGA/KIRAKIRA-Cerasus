<script setup lang="ts">
	import { AVWaveform } from "vue-audio-visual";
	import audioPath from "assets/audios/test.mp3";

	const canvas = ref<HTMLCanvasElement>();
	const source = ref<AudioBufferSourceNode>();
	const isPlaying = ref(false);

	useHead({ title: "测试音频" });

	/**
	 * 初始化频谱。
	 * @param audioPath - 音频地址。
	 */
	async function initSpectrum(audioPath: string) {
		const audioContext = new AudioContext();
		const response = await fetch(audioPath);
		const arrayBuffer = await response.arrayBuffer();
		audioContext.decodeAudioData(arrayBuffer, buffer => {
			if (!canvas.value) throw new ReferenceError("Canvas 不存在。");
			// 创建分析器
			const analyser = audioContext.createAnalyser();
			source.value = audioContext.createBufferSource();
			// 将 source 与分析器链接
			source.value.connect(analyser);
			// 将分析器与 destination 链接，这样才能形成到达扬声器的通路
			analyser.connect(audioContext.destination);
			// 将解码后的 buffer 数据复制给 source
			source.value.buffer = buffer;

			// 开始绘制频谱图
			const cwidth = canvas.value.width;
			const cheight = canvas.value.height;
			const ctx = canvas.value.getContext("2d")!;
			// 定义一个渐变样式用于画图
			const gradient = ctx.createLinearGradient(0, 0, 0, 300);
			gradient.addColorStop(1, "#0f0");
			gradient.addColorStop(0.5, "#ff0");
			gradient.addColorStop(0, "#f00");
			ctx.fillStyle = gradient;
			/** 绘制频谱图 */
			function drawSpectrum() {
				const array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				// 清理画布
				ctx.clearRect(0, 0, cwidth, cheight);
				// 只绘制出当前宽度内的线
				// 从频率分布数据中可以看到数组中大于 800 的数据都是 0
				for (let i = 0; i < cwidth; i++) {
					const value = array[i];
					ctx.fillRect(i, cheight - value, 1, cheight);
				}
				requestAnimationFrame(drawSpectrum);
			}
			requestAnimationFrame(drawSpectrum);
		});
	}

	onMounted(() => {
		initSpectrum(audioPath);
	});

	/**
	 * 点击播放。
	 */
	function onClickPlay() {
		if (!source.value) return;
		isPlaying.value ? source.value.stop() : source.value.start(0);
		isPlaying.value = !isPlaying.value;
	}
</script>

<template>
	<div class="container">
		<h2>测试音频与频谱功能</h2>
		<!-- <Button @click="onClickPlay">停止</Button><br />
		<canvas ref="canvas" width="800" height="300"></canvas> -->
		<AVWaveform ref="audio" :src="audioPath" />
	</div>
</template>

<style scoped lang="scss">
	.container {
		padding: 26px 100px;
	}

	audio {
		width: 100%;
	}
</style>
