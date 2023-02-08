<script setup lang="ts">
	import mediainfo from "mediainfo.js";
	import { basename } from "path-browserify";

	const props = defineProps<{
		src: string;
	}>();

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
	 * 获取视频详细信息，使用库 `mediainfo.js`。
	 * @param videoPath - 视频地址。
	 */
	async function getInfo(videoPath: string) {
		const blob = await fetch(videoPath).then(response => response.blob());
		const fileName = basename(videoPath);
		const file = new File([blob], fileName, { type: "video/mp4" });
		const getSize = () => file.size;
		const readChunk = (chunkSize: number, offset: number) => new Promise<Uint8Array>(resolve => {
			const reader = new FileReader();
			reader.onload = event =>
				resolve(new Uint8Array(((event.target as FileReader).result as ArrayBuffer)));
			reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
		});
		const mediaInfo = await mediainfo();
		const result = mediaInfo.analyzeData(getSize, readChunk);
		mediaInfos.value = {
			// @ts-ignore
			...result.media.track[0],
			// @ts-ignore
			...result.media.track[1],
			// @ts-ignore
			...result.media.track[2],
		};
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

	/**
	 * 当视频已经准备好可以播放时执行的事件。
	 * @param e - 普通事件。
	 */
	function onCanPlay(e: Event | { target: EventTarget }) {
		const video = e.target as HTMLVideoElement;
		playing.value = !video.paused;
		playbackRate.value = video.playbackRate;
		currentTime.value = video.currentTime;
		duration.value = video.duration;
		video.preservesPitch = preservesPitch.value;
	}

	/**
	 * 视频时间码变化事件。
	 * @param e - 普通事件。
	 */
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
			<p v-for="(mediaInfo, key) in mediaInfos" :key="`media-info-${key}`">{{ key }}:{{ mediaInfo }},</p>
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
			@contextmenu.prevent="getInfo(src)"
		>
		</video>
		<PlayerVideoController
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
