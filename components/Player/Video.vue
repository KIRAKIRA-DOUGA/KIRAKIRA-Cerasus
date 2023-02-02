<script setup lang="ts">
	const props = defineProps<{
		src: string;
	}>();

	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const isTimeUpdating = ref(false);

	const video = ref<HTMLVideoElement>();
	const videoPlayer = ref<HTMLElement>();
	const { isFullscreen: fullScreen, toggle } = useFullscreen(video);

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

	/* watch(fullScreen, fullScreen => {
		if (!videoPlayer.value) return;
		if (fullScreen) videoPlayer.value.requestFullscreen();
		else if (document.fullscreenElement) document.exitFullscreen();
	}); */

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
		<video
			ref="video"
			:src="src"
			@play="() => (playing = true)"
			@pause="() => (playing = false)"
			@ratechange="e => (playbackRate = (e.target as HTMLVideoElement).playbackRate)"
			@timeupdate="onTimeUpdate"
			@canplay="onCanPlay"
			@click="playing = !playing"
			@dblclick="fullScreen = !fullScreen"
		></video>
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
</style>
