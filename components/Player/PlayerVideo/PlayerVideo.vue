<script setup lang="ts">
	import mediainfo from "mediainfo.js";
	import { MediaPlayerClass, BitrateInfo } from "dashjs";

	const props = defineProps<{
		/** 视频源。 */
		src: string;
		/** 视频 ID。 */
		id: number;
		/** 视频评分。 */
		rating: number;
	}>();

	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const steplessRate = ref(false);
	const volume = ref(1);
	const muted = ref(false);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const buffered = ref(0);
	const isTimeUpdating = ref(false);
	const showMediaInfo = ref(false);
	const currentQuality = ref("720P");

	const qualities = ref<BitrateInfo[]>([]);
	const mediaInfos = ref<MediaInfo>();
	const videoContainer = ref<HTMLDivElement>();
	const video = ref<HTMLVideoElement>();
	const { isFullscreen: fullscreen, toggle } = useFullscreen(videoContainer);
	const resample = computed({ get: () => !preservesPitch.value, set: value => preservesPitch.value = !value });
	const menu = ref<MenuModel>();
	const showDanmaku = ref(true);
	const willSendDanmaku = ref<DanmakuComment>();
	const willInsertDanmaku = ref<DanmakuListItem>();

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
		video.value.volume = volume ** 2; // 使用对数音量。
	});

	watch(muted, muted => {
		if (!video.value) return;
		video.value.muted = muted;
	});

	watch(fullscreen, fullscreen => {
		if (fullscreen)
			try {
				screen.orientation.lock("landscape");
				// 全屏时请求横屏。在设备不支持或安全问题时可能会报错，以后正式上线时记得把错误吞掉。
			} catch { }
		else
			screen.orientation.unlock();
	});

	watch(willSendDanmaku, danmaku => {
		if (danmaku)
			willInsertDanmaku.value = {
				videoTime: new Duration(currentTime.value),
				content: danmaku.text!,
				sendTime: new Date(),
			};
	});

	const player = ref<MediaPlayerClass>();

	onMounted(async () => {
		if (!video.value) return;
		onCanPlay({ target: video.value });

		if (process.client) {
			const Dash = await import("dashjs"); // 注意看，由于 Dash 无法在服务端下渲染，因此必须动态导入。
			player.value = Dash.MediaPlayer().create();

			player.value.on(Dash.MediaPlayer.events.STREAM_INITIALIZED, _e => {
				player.value!.on(Dash.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, _e => {
					const qual = player.value!.getQualityFor("video");
					const currentQual = qualities.value[qual];
					if (currentQual !== undefined)
						currentQuality.value = currentQual.height + "P";
				});

				const bitrateInfoList = player.value!.getBitrateInfoListFor("video");
				player.value!.setQualityFor("video", bitrateInfoList.length - 1);
				qualities.value = bitrateInfoList;
			});

			player.value.initialize(video.value, props.src, false);

			player.value.updateSettings({
				streaming: {
					buffer: {
						fastSwitchEnabled: true,
					},
					abr: {
						// initialBitrate: { audio: 2000000, video: 2000000 }, // 2mb/s, lol
						// maxBitrate: { audio: 2000000000000, video: 20000000000000 }, // lmao this can't be right
					},
				},
			});

			player.value.attachView(video.value);
		}
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

	const quality = computed({
		get: () => currentQuality.value,
		set: quality => {
			// TODO CRINGE ALERT COPY PASTA
			const qualityList = qualities.value.map(qual => qual.height + "P");
			const index = qualityList.findIndex(qual => qual === quality);
			player.value?.setQualityFor("video", index);
			player.value?.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
		},
	});

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

		<div ref="videoContainer" class="main" :class="{ fullscreen }">
			<video
				ref="video"
				class="player"
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
			<PlayerVideoDanmaku v-model="willSendDanmaku" :media="video" :hidden="!showDanmaku" />
			<PlayerVideoController
				:key="qualities.length"
				v-model:currentTime="currentTime"
				v-model:playing="playing"
				v-model:fullscreen="fullscreen"
				v-model:playbackRate="playbackRate"
				v-model:volume="volume"
				v-model:muted="muted"
				v-model:resample="resample"
				v-model:steplessRate="steplessRate"
				v-model:showDanmaku="showDanmaku"
				v-model:quality="quality"
				:duration="duration"
				:toggleFullscreen="toggle"
				:buffered="buffered"
				:qualities="qualities"
			/>
		</div>

		<PlayerVideoPanel
			:id="id"
			v-model:sendDanmaku="willSendDanmaku"
			v-model:insertDanmaku="willInsertDanmaku"
			:getTime="() => currentTime"
			:rating="rating"
		/>
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

	.main {
		position: relative;
		background-color: black;

		&:not(.fullscreen) {
			&,
			& video {
				width: 100%;
			}

			& video {
				max-height: 70dvh;
			}
		}

		&.fullscreen {
			display: flex;
			flex-direction: column;
			height: 100dvh;

			video {
				width: 100%;
				height: 100%;
			}
		}
	}

	table {
		border-radius: 0;
	}

	.menu-item {
		color: c(text-color) !important; // 避免黑底视频看不清文字。
	}
</style>
