<script setup lang="ts">
	const props = defineProps<{
		src: string;
	}>();
	import mediainfo, { ReadChunkFunc } from "mediainfo.js";
	import urlToBlob from "components/Player/transform"; // TODO: 稍后移动到 utils 文件夹。
	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const isTimeUpdating = ref(false);
	const mediaInfoDiv = ref(false);
	const mediaInfos = ref();
	const video = ref<HTMLVideoElement>();
	const videoPlayer = ref<HTMLElement>();
	const { isFullscreen: fullScreen, toggle } = useFullscreen(video);

	/**
	 * 获取视频详细信息，使用库mediainfo.js
	 */
	function getInfo(videoPath: string) {
		let file: File;
		urlToBlob(videoPath, (result: Blob) => {
			file = new File([result], "test.mp4", { type: "video/mp4" }); // TODO: 字面量文件地址？
			const getSize = () => file.size;
			const readChunk = (chunkSize: number, offset: number) =>
				new Promise(resolve => {
					const reader = new FileReader();
					reader.onload = event => {
						resolve(new Uint8Array(((event.target as FileReader).result as ArrayBuffer)));
					};
					reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
				});
			mediainfo().then(mediainfo => {
				mediainfo
					.analyzeData(getSize, (readChunk as ReadChunkFunc))
					.then(result => {
						// 虽然这是result类型，但它的确是一个对象数组
						mediaInfos.value = {
							// @ts-ignore
							...result.media.track[0],
							// @ts-ignore
							...result.media.track[1],
							// @ts-ignore
							...result.media.track[2],
						};
					});
			});
		});
		mediaInfoDiv.value = !mediaInfoDiv.value;
	}
	watch(playing, playing => {
		if (!video.value) return;
		playing ? video.value.play() : video.value.pause();
	});

	watch(currentTime, currentTime => {
		if (!video.value || isTimeUpdating.value) return;
		video.value.currentTime = currentTime;
	});

	watch(preservesPitch, preservesPitch => {
		if (!video.value) return;
		video.value.preservesPitch = preservesPitch;
	});

	watch(playbackRate, playbackRate => {
		if (!video.value) return;
		video.value.playbackRate = playbackRate;
	});

	onMounted(() => {
		if (video.value) onCanPlay({ target: video.value });
	});

	function onCanPlay(e: Event | { target: EventTarget }) {
		const video = e.target as HTMLVideoElement;
		playing.value = !video.paused;
		playbackRate.value = video.playbackRate;
		currentTime.value = video.currentTime;
		duration.value = video.duration;
		video.preservesPitch = preservesPitch.value;
	}

	async function onTimeUpdate(e: Event) {
		const video = e.target as HTMLVideoElement;
		isTimeUpdating.value = true;
		currentTime.value = video.currentTime;
		await nextTick();
		isTimeUpdating.value = false;
	}
</script>

<template>
	<section ref="videoPlayer" class="video-player">
		<div v-if="mediaInfoDiv" class="media-info">
			视频详细信息
			<!-- eslint-disable-next-line vue/require-v-for-key -->
			<p v-for="(mediaInfo, key) in mediaInfos">{{ key }}:{{ mediaInfo }},</p>
		</div>
		<video
			ref="video"
			:src="src"
			@play="() => (playing = true)"
			@pause="() => (playing = false)"
			@ratechange="e => (playbackRate = (e.target as HTMLVideoElement).playbackRate)"
			@timeupdate="onTimeUpdate"
			@canplay="onCanPlay"
			@click="playing = !playing"
			@dblclick="toggle"
			@contextmenu.prevent="getInfo(videoPath)"
		>
		</video>
		<PlayerController
			v-model:currentTime="currentTime"
			v-model:playing="playing"
			v-model:fullScreen="fullScreen"
			v-model:playbackRate="playbackRate"
			:duration="duration"
			:toggleFullScreen="toggle"
		/>
	</section>
</template>

<style scoped lang="scss">
	section.video-player {
		@include player-shadow;
		display: flex;
		flex-direction: column;
	}

	video {
		width: 100%;
	}

	.media-info {
		position: absolute;
		display: block;
		width: 800px;
		color: white;
		font-weight: 800;
		background-color: #5c5858;
		border-radius: 10px;
		opacity: 0.4;
	}
</style>


