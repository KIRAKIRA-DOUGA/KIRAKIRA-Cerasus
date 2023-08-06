<script setup lang="ts">
	import mediainfo from "mediainfo.js";
	const props = defineProps<{
		src: string;
	}>();

	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const volume = ref(1);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const buffered = ref(0);
	const isTimeUpdating = ref(false);
	const showMediaInfo = ref(false);
	const mediaInfos = ref<MediaInfo>();
	const videoContainer = ref<HTMLDivElement>();
	const video = ref<HTMLVideoElement>();
	const { isFullscreen: fullScreen, toggle } = useFullscreen(videoContainer);
	const menu = ref<MenuModel>();

	type MediaInfo = Record<string, Record<string, unknown>>;

	/**
	 * 显示视频详细信息。
	 */
	async function showInfo() {
		if (!mediaInfos.value) await getInfo(props.src);
		if (mediaInfos.value) showMediaInfo.value = true;
	}

	/**
	 * 获取视频详细信息，使用库 `mediainfo.js`。
	 * @param videoPath - 视频地址。
	 */
	async function getInfo(videoPath: string) {
		const response = await fetch(videoPath);
		const blob = await response.blob();
		const fileName = path.basename(videoPath);
		const file = new File([blob], fileName);
		const mediaInfo = await mediainfo();
		const result = await mediaInfo.analyzeData(() => file.size,
			(chunkSize, offset) => new Promise<Uint8Array>((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
				reader.onerror = reject;
				reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
			}));
		if (typeof result === "string") return; // 仅在会报错时 result 取值为空字符串，如报错在此之前已会报错，忽略之。
		const tracks = result.media.track;
		mediaInfos.value = {};
		for (const track of tracks) {
			const { "@type": type, ...info } = track;
			mediaInfos.value[type] = info;
		}
		showMediaInfo.value = true;
	}

	watch(() => props.src, () => mediaInfos.value = undefined);

	watch(playing, playing => {
		if (!video.value) return;
		video.value[playing ? "play" : "pause"]();
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

	watch(volume, volume => {
		if (!video.value) return;
		video.value.volume = volume;
	});

	const player = ref(null);

	onMounted(async () => {
		if (video.value) onCanPlay({ target: video.value });
		const dashjs = await import("dashjs");

		player.value = dashjs.MediaPlayer().create();
		player.value.initialize(video.value, props.src, true);
		player.value.updateSettings({
			streaming: {
				abr: {
					initialBitrate: { audio: 2000000, video: 2000000 }, // 2mb/s, lol
					// maxBitrate: { audio: 2000000000000, video: 20000000000000 }, // lmao this can't be right
				},
			},
		});

		player.value.attachView(video.value);
	});

	// onBeforeUnmount(() => {
	// 	if (video.value != null)
	// 		video.value.destroy();
	// });

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

	/**
	 * 视频加载缓冲事件。
	 * @param e - 普通事件。
	 */
	function onProgress(e: Event) {
		const video = e.target as HTMLVideoElement;
		try {
			buffered.value = video.buffered.end(0);
			// TODO: 这个只能获取视频缓存的总长度值，当用户手动跳时间时，会导致显示不准确。待优化。
		} catch { }
	}
</script>

<template>
	<Comp>
		<Alert v-model="showMediaInfo" title="视频详细信息">
			<Accordion>
				<AccordionItem v-for="(info, type) in mediaInfos" :key="type" :title="type" noPadding>
					<table>
						<thead>
							<th>项目</th>
							<th>值</th>
						</thead>
						<tbody>
							<tr v-for="(value, property) in info" :key="property">
								<td>{{ property }}</td>
								<td>{{ value }}</td>
							</tr>
						</tbody>
					</table>
				</AccordionItem>
			</Accordion>
		</Alert>

		<div ref="videoContainer" :class="['main', { fullscreen: fullScreen }]">
			<video
				ref="video"
				@play="playing = true"
				@pause="playing = false"
				@ratechange="e => playbackRate = (e.target as HTMLVideoElement).playbackRate"
				@timeupdate="onTimeUpdate"
				@canplay="onCanPlay"
				@progress="onProgress"
				@click="playing = !playing"
				@dblclick="toggle"
				@contextmenu.prevent="e => menu = e"
			>
			</video>
			<PlayerVideoController
				v-model:currentTime="currentTime"
				v-model:playing="playing"
				v-model:fullScreen="fullScreen"
				v-model:playbackRate="playbackRate"
				v-model:volume="volume"
				:duration="duration"
				:toggleFullScreen="toggle"
				:buffered="buffered"
			/>
		</div>

		<PlayerVideoPanel />
		<Menu v-model="menu">
			<MenuItem icon="info" @click="showInfo">查看视频详细信息</MenuItem>
		</Menu>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include player-shadow;
		display: flex;
		flex-direction: row;
		background-color: c(surface-color);
	}

	.main:not(.fullscreen), .main:not(.fullscreen) video {
		width: 100%;
	}

	.main.fullscreen {
		display: flex;
		flex-direction: column;
		height: 100dvh;
	}

	table {
		border-radius: 0;
	}
</style>
