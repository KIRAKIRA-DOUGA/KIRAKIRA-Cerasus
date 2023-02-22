<script setup lang="ts">
	import mediainfo from "mediainfo.js";
	import { basename } from "path-browserify";
	import { Menu } from "#components";

	const props = defineProps<{
		src: string;
	}>();

	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const isTimeUpdating = ref(false);
	const showMediaInfo = ref(false);
	const mediaInfos = ref<MediaInfo>();
	const video = ref<HTMLVideoElement>();
	const videoPlayer = ref<HTMLElement>();
	const { isFullscreen: fullScreen, toggle } = useFullscreen(video);
	const menu = ref<InstanceType<typeof Menu>>();

	type MediaInfo = {
		[type: string]: Record<string, unknown>;
	};

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
		const _result = await mediaInfo.analyzeData(getSize, readChunk);
		const result = _result as Exclude<typeof _result, string>;
		const tracks = result.media.track;
		mediaInfos.value = {};
		for (const track of tracks) {
			const { "@type": type, ...info } = track;
			mediaInfos.value[type] = info;
		}
		showMediaInfo.value = !showMediaInfo.value;
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

	const showMenu = (e: MouseEvent) => menu.value?.show(e);
</script>

<template>
	<kira-component ref="videoPlayer" class="player-video">
		<Dialog v-model="showMediaInfo" title="视频详细信息">
			<details v-for="(info, type) in mediaInfos" :key="type">
				<summary>{{ type }}</summary>
				<table>
					<tbody>
						<tr v-for="(value, property) in info" :key="property">
							<td>{{ property }}</td>
							<td>{{ value }}</td>
						</tr>
					</tbody>
				</table>
			</details>
		</Dialog>
		<video
			ref="video"
			:src="src"
			@play="playing = true"
			@pause="playing = false"
			@ratechange="e => (playbackRate = (e.target as HTMLVideoElement).playbackRate)"
			@timeupdate="onTimeUpdate"
			@canplay="onCanPlay"
			@click="playing = !playing"
			@dblclick="toggle"
			@contextmenu.prevent="showMenu"
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
		<Menu ref="menu">
			<MenuItem @click="getInfo(src)">查看视频详细信息</MenuItem>
		</Menu>
	</kira-component>
</template>

<style scoped lang="scss">
	.player-video {
		@include player-shadow;
		@include flex-block;
	}

	video {
		width: 100%;
	}

	.media-info {
		@include radius-large;
		position: absolute;
		z-index: 2;
		width: 800px;
		padding: 1rem;
		color: white;
		font-weight: 800;
		background-color: #5c5858;
		opacity: 0.5;
	}
</style>
