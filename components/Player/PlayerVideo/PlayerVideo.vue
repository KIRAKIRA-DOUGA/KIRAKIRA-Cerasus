<docs>
	# YOZORA PLAYER
	视频播放器。
</docs>

<script setup lang="ts">
	import type shaka from "shaka-player";
	import { numbers } from "virtual:scss-var:theme/_variables";
	import { basicDanmakuCommentStyle, createDanmakuComment } from "./PlayerVideoDanmakuSender.vue";

	const props = defineProps<{
		/** 视频源。 */
		src: string;
		/** 视频 ID。 */
		videoId: number;
		/** 视频标题。 */
		title: string;
		/** 视频封面地址。 */
		thumbnail: string;
	}>();

	const windowSize = useWindowSize();
	const isMobileWidth = computed(() => windowSize.width.value <= numbers.tabletMaxWidth);

	const playing = defineModel("playing", { default: false });
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const continuousRateControl = ref(false);
	const volume = ref(1);
	const muted = ref(false);
	const currentTime = defineModel<number>("currentTime", { default: NaN });
	const duration = ref(NaN);
	const buffered = ref<[number, number][]>([]);
	const isTimeUpdating = ref(false);
	const ended = ref(false);
	const waiting = ref(true);
	const showStats = ref(false);
	const splash = ref(true);
	const showAboutPlayer = ref(false);
	const activeTrack = ref<shaka.extern.Track>();
	const autoQuality = ref(true);
	const settings = reactive<PlayerVideoSettings>({
		autoplay: false,
		danmaku: {
			fontSizeScale: 1,
			opacity: 1,
		},
		controller: {
			showStop: false,
			showReplay: false,
			showFrameByFrame: false,
			autoResumePlayAfterSeeking: false,
		},
		filter: {
			horizontalFlip: false,
			verticalFlip: false,
			rotation: 0,
			grayscale: false,
			invert: false,
			sepia: false,
			hue: 0,
			saturate: 1,
			contrast: 1,
			brightness: 1,
		},
	});

	const videoFilterStyle = computed(() => {
		const { filter } = settings;
		const style: CSSProperties = {};
		if (filter.horizontalFlip || filter.verticalFlip) {
			const scale: TwoD = [1, 1];
			if (filter.horizontalFlip) scale[0] = -1;
			if (filter.verticalFlip) scale[1] = -1;
			style.scale = scale.join(" ");
		}
		if (filter.rotation) style.rotate = filter.rotation + "deg";
		const filters: string[] = [];
		if (filter.grayscale) filters.push("grayscale(1)");
		if (filter.invert) filters.push("invert(1)");
		if (filter.sepia) filters.push("sepia(1)");
		if (filter.hue % 360 !== 0) filters.push(`hue-rotate(${filter.hue}deg)`);
		if (filter.saturate !== 1) filters.push(`saturate(${filter.saturate})`);
		if (filter.contrast !== 1) filters.push(`contrast(${filter.contrast})`);
		if (filter.brightness !== 1) filters.push(`brightness(${filter.brightness})`);
		if (filters.length > 0) style.filter = filters.join(" ");
		return style;
	});

	const tracks = ref<shaka.extern.Track[]>([]);
	const video = ref<HTMLVideoElement>();
	const playerVideoMain = ref<HTMLDivElement>();
	const { exit: exitFullscreen, enter: enterFullscreen } = useFullscreen();
	const fullscreen = ref(false); // 是否独占整个浏览器画面？
	const resample = computed({ get: () => !preservesPitch.value, set: value => preservesPitch.value = !value });
	const menu = ref<MenuModel>();
	const showDanmaku = ref(true);
	const hideController = ref(false);
	const hideControllerTimeoutId = ref<Timeout>();
	const hideCursor = ref(false);
	const hideCursorTimeoutId = ref<Timeout>();
	const dblClickCount = ref(0);
	const dblClickTimeoutId = ref<Timeout>();
	const refreshStatsIntervalId = ref<Timeout>();
	const willSendDanmaku = defineModel<DanmakuComment[]>("sendDanmaku");
	const willInsertDanmaku = defineModel<DanmakuListItem[]>("insertDanmaku");
	const initialDanmaku = ref<DanmakuComment[]>();
	const screenOrientationBeforeFullscreen = ref<OrientationType>("portrait-primary");
	const playerVideoControllerMouseDown = ref(false);
	const playerConfig = useAppSettingsStore().player;

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
		playerConfig.rate.preservesPitch = preservesPitch;
	});

	watch(continuousRateControl, continuousRateControl => {
		playerConfig.rate.continuousControl = continuousRateControl;
	});

	watch(playbackRate, playbackRate => {
		if (!video.value) return;
		video.value.playbackRate = playbackRate;
	});

	watch(volume, volume => {
		const logarithmicVolume = volume ** 2; // 使用对数音量。
		if (video.value) {
			video.value.volume = logarithmicVolume;
			playerConfig.audio.volume = volume;
		}
	});

	watch(muted, muted => {
		if (video.value) {
			video.value.muted = muted;
			playerConfig.audio.muted = muted;
		}
	});

	watch(() => settings.autoplay, autoplay => {
		playerConfig.autoplay = autoplay;
	});

	watch(() => settings.danmaku.opacity, opacity => {
		playerConfig.danmaku.opacity = opacity;
	});

	watch(() => settings.danmaku.fontSizeScale, size => {
		playerConfig.danmaku.fontSizeScale = size;
	});

	watch(() => settings.controller.showStop, showStop => {
		playerConfig.controller.showStop = showStop;
	});

	watch(() => settings.controller.showReplay, showReplay => {
		playerConfig.controller.showReplay = showReplay;
	});

	watch(() => settings.controller.showFrameByFrame, showFrameByFrame => {
		playerConfig.controller.showFrameByFrame = showFrameByFrame;
	});

	watch(() => settings.controller.autoResumePlayAfterSeeking, autoResumePlayAfterSeeking => {
		playerConfig.controller.autoResumePlayAfterSeeking = autoResumePlayAfterSeeking;
	});

	watch(fullscreen, fullscreen => { // 全屏时请求横屏。在设备不支持或安全问题时有可能会报错。
		if (fullscreen) {
			screenOrientationBeforeFullscreen.value = screen.orientation.type;
			screen.orientation.lock("landscape").catch(useNoop);
			autoHideController(); // 进入全屏后自动开始隐藏控制栏计时。
		} else {
			screen.orientation.lock(screenOrientationBeforeFullscreen.value).catch(useNoop);
			screen.orientation.unlock();
			hideController.value = false; // 退出全屏时确保显示播放器控制栏。
		}
	});

	const fontSizes = {
		small: 14,
		medium: 20,
		large: 28,
	};

	/**
	 * Fetch video danmaku
	 */
	async function fetchDanmaku() {
		try {
			const getDanmakuByKvidRequest: GetDanmakuByKvidRequestDto = { videoId: props.videoId };
			const danmakuListResult = await api.danmaku.getDanmakuByKvid(getDanmakuByKvidRequest);

			if (danmakuListResult.success && danmakuListResult.danmaku && danmakuListResult.danmaku.length > 0) {
				// 初始化视频上的弹幕列表
				initialDanmaku.value = danmakuListResult.danmaku.map(danmaku => ({
					text: danmaku.text,
					mode: danmaku.mode,
					time: danmaku.time,
					style: {
						...basicDanmakuCommentStyle,
						fontSize: `${fontSizes[danmaku.fontSize]}px`,
						color: `#${danmaku.color}`,
					},
				}));
				// 初始化视频旁边的弹幕列表
				willInsertDanmaku.value = danmakuListResult.danmaku.map(danmaku => ({
					videoTime: new Duration(danmaku.time),
					content: danmaku.text,
					sendTime: new Date(danmaku.editDateTime),
				}));
			}
		} catch (error) {
			useToast(t.player.error.getDanmaku, "error");
			console.error("ERROR", "Failed to get danmaku:", error);
		}
	}
	watch(() => props.videoId, fetchDanmaku, { immediate: true });

	watch(willSendDanmaku, danmaku => {
		if (danmaku)
			willInsertDanmaku.value = danmaku.map(e => ({
				videoTime: new Duration(e.time ?? currentTime.value),
				content: e.text!,
				sendTime: new Date(), // TODO: Get when did the danmaku send.
			}));
	});

	/**
	 * 从 Pinia 中加载播放器设置。
	 */
	volume.value = playerConfig.audio.volume;
	muted.value = playerConfig.audio.muted;
	preservesPitch.value = playerConfig.rate.preservesPitch;
	continuousRateControl.value = playerConfig.rate.continuousControl;
	autoQuality.value = playerConfig.quality.auto;
	settings.autoplay = playerConfig.autoplay;
	settings.danmaku.opacity = playerConfig.danmaku.opacity;
	settings.danmaku.fontSizeScale = playerConfig.danmaku.fontSizeScale;
	settings.controller.showStop = playerConfig.controller.showStop;
	settings.controller.showReplay = playerConfig.controller.showReplay;
	settings.controller.showFrameByFrame = playerConfig.controller.showFrameByFrame;
	settings.controller.autoResumePlayAfterSeeking = playerConfig.controller.autoResumePlayAfterSeeking;

	const player = ref<shaka.Player>();
	const playerVersion = ref("");

	onMounted(async () => {
		if (!video.value) return;
		onCanPlay({ target: video.value });

		if (environment.client) {
			const shaka = (await import("shaka-player")).default; // 由于 Shaka Player 无法在服务端下渲染，因此必须动态导入。
			player.value = new shaka.Player();
			player.value.attach(video.value);
			const eventManager = new shaka.util.EventManager();

			playerVersion.value = shaka.Player.version;

			/**
			 * 设置 Shaka Player。
			 */
			player.value.configure({
				abr: {
					enabled: autoQuality.value,
				},
				manifest: {
					dash: {
						ignoreMinBufferTime: true, // @see https://shaka-player-demo.appspot.com/docs/api/
					},
				},
			});

			/**
			 * 监听首次加载完毕。
			 */
			eventManager.listenOnce(video.value, "canplaythrough", () => {
				currentTime.value = video.value!.currentTime;
				splash.value = false;
			});

			/**
			 * 监听轨道变化事件。
			 */
			eventManager.listen(player.value, "trackschanged", () => {
				tracks.value = player.value!.getVariantTracks();
				activeTrack.value = tracks.value.find(e => e.active)!;
			});

			/**
			 * 监听自动质量变化事件。
			 */
			eventManager.listen(player.value, "adaptation", e => {
				activeTrack.value = e.newTrack;
			});

			/**
			 * 监听手动质量变化事件。
			 */
			eventManager.listen(player.value, "variantchanged", e => {
				activeTrack.value = e.newTrack;
			});

			/**
			 * 监听错误事件。
			 */
			eventManager.listen(player.value, "error", e => {
				console.error("Error Code:", e.detail.code, "Object:", e.detail);
			});

			/**
			 * 加载视频。
			 */
			try {
				await player.value.load(props.src);
				if (!autoQuality.value)
					for (let id = 0; id < tracks.value.length; id++)
						if (tracks.value[id].height === playerConfig.quality.preferred) {
							player.value.selectVariantTrack(tracks.value[id], true);
							break;
						}
			} catch (error) {
				console.error("ERROR", "Failed to load the video:", error);
			}
		}
	});

	const selectedTrack = computed({
		get: () => activeTrack.value,
		set: track => {
			player.value?.selectVariantTrack(track, true);
			playerConfig.quality.preferred = track!.height!;
		},
	});

	watch(autoQuality, autoQuality => {
		if (!video.value || !player.value) return;
		player.value.configure({ abr: { enabled: autoQuality } });
		playerConfig.quality.auto = autoQuality;
	});

	watch(showStats, showStats => {
		if (showStats) {
			getStats();
			refreshStatsIntervalId.value = setInterval(() => { getStats(); }, 1000);
		} else clearInterval(refreshStatsIntervalId.value);
	});

	const statsPlayer = ref({ manifestType: "", streamBandwidth: 0, estimatedBandwidth: 0, resolution: { width: 0, height: 0 }, frames: { decoded: 0, dropped: 0 } });
	const statsVideo = ref({ codec: "", mimeType: "", bitRate: 0, resolution: { width: 0, height: 0 }, frameRate: 0 });
	const statsAudio = ref({ codec: "", mimeType: "", bitRate: 0, sampleRate: 0 });

	/**
	 * 获取视频详细信息
	 */
	function getStats() {
		if (!player.value || !video.value) return;
		const stats = player.value?.getStats();
		if (!stats) return;
		const a = activeTrack.value;

		assign(statsVideo.value, {
			codec: a?.videoCodec ?? "",
			mimeType: a?.videoMimeType ?? "",
			bitRate: a?.videoBandwidth ?? 0,
			resolution: { width: a?.width ?? 0, height: a?.height ?? 0 },
			frameRate: a?.frameRate ?? 0,
		});

		assign(statsAudio.value, {
			codec: a?.audioCodec ?? "",
			mimeType: a?.audioMimeType ?? "",
			bitRate: a?.audioBandwidth ?? 0,
			sampleRate: a?.audioSamplingRate ?? 0,
		});

		assign(statsPlayer.value, {
			manifestType: player.value.getManifestType() ?? "",
			streamBandwidth: stats.streamBandwidth ?? 0,
			estimatedBandwidth: stats.estimatedBandwidth ?? 0,
			resolution: { width: stats.width ?? 0, height: stats.height ?? 0 },
			frames: {
				decoded: stats.decodedFrames ?? 0,
				dropped: stats.droppedFrames ?? 0,
			},
		});
	}

	/**
	 * 当视频已经准备好可以播放时执行的事件。
	 * @param e - 普通事件。
	 */
	function onCanPlay(e: Event | { target: EventTarget }) {
		const video = e.target as HTMLVideoElement;
		playing.value = !video.paused;
		duration.value = video.duration;
		video.preservesPitch = preservesPitch.value;
		video.volume = volume.value ** 2; // 使用对数音量。
		video.muted = muted.value;
		waiting.value = false;
		updateBuffered();
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
		ended.value = false;
	}

	/**
	 * 更新缓冲进度。
	 */
	function updateBuffered() {
		if (!video.value) return;
		const videoBuffered = video.value.buffered;
		buffered.value = forMap(videoBuffered.length, index => [videoBuffered.start(index), videoBuffered.end(index)]);
	}

	/**
	 * 视频指针松开事件。
	 * @param e - 指针事件。
	 */
	function onVideoPointerUp(e: PointerEvent) {
		dblClickCount.value++;
		if (dblClickCount.value === 1)
			dblClickTimeoutId.value = setTimeout(() => {
				dblClickCount.value = 0;
				useEvent("component:hideAllPlayerVideoMenu");
				if (isMouse(e))
					playing.value = !playing.value;
				else if (fullscreen.value) {
					hideController.value = !hideController.value;
					if (!hideController.value) {
						clearTimeout(hideControllerTimeoutId.value);
						hideControllerTimeoutId.value = setTimeout(() => {
							hideController.value = true;
						}, 3000);
					}
				}
			}, 300);
		else {
			dblClickCount.value = 0;
			clearTimeout(dblClickTimeoutId.value);
			if (isMouse(e))
				toggleFullscreen();
			else
				playing.value = !playing.value;
		}
	}

	/**
	 * 视频控制器触摸开始事件。
	 */
	function onPlayerVideoControllerTouchStart() {
		if (fullscreen.value)
			clearTimeout(hideControllerTimeoutId.value);
	}

	/**
	 * 视频控制器触摸结束事件。
	 */
	function onPlayerVideoControllerTouchEnd() {
		if (fullscreen.value && !hideController.value)
			hideControllerTimeoutId.value = setTimeout(() => {
				hideController.value = true;
				useEvent("component:hideAllPlayerVideoMenu");
			}, 3000);
	}

	/**
	 * 在全屏时自动隐藏控制栏。
	 * @param e - 指针移动事件。
	 */
	function autoHideController(e?: PointerEvent) {
		const BOTTOM = 36;
		if (e && (!fullscreen.value || playerVideoControllerMouseDown.value ||
			window.innerHeight - e.pageY <= BOTTOM || e.pageY <= BOTTOM))
			hideController.value = false;
		else if (e?.pointerType !== "touch")
			hideController.value = true;

		hideCursor.value = false;
		clearTimeout(hideCursorTimeoutId.value);
		if (fullscreen.value && hideController.value)
			hideCursorTimeoutId.value = setTimeout(() => fullscreen.value && (hideCursor.value = true), 1000);
	}

	useEventListener("window", "mouseup", () => playerVideoControllerMouseDown.value = false);

	/**
	 * 切换全屏。
	 * @param isFullbrowser - 是否是网页全屏？
	 */
	async function toggleFullscreen(isFullbrowser: boolean = false) {
		// 触发全屏 API
		if (fullscreen.value)
			await exitFullscreen();
		else if (!isFullbrowser)
			await enterFullscreen();

		// 处理 tab 失能问题（不然全屏状态下按 tab 键甚至会聚焦到评论区去）
		if (playerVideoMain.value)
			for (const element of document.getElementById("root")?.querySelectorAll("*") ?? []) {
				if (!(element instanceof HTMLElement) || playerVideoMain.value.contains(element)) continue;
				if (!fullscreen.value) {
					if (element.tabIndex === -1) continue;
					if (!element.getAttribute("tabIndex")) element.dataset.defaultTabIndex = "true";
					element.dataset.tabIndex = String(element.tabIndex);
					element.tabIndex = -1;
				} else {
					if (element.dataset.tabIndex === undefined) continue;
					if (!element.dataset.defaultTabIndex)
						element.tabIndex = parseInt(element.dataset.tabIndex, 10);
					else
						element.removeAttribute("tabIndex");
					delete element.dataset.tabIndex;
					delete element.dataset.defaultTabIndex;
				}
			}

		// 启动视图过渡动画
		startViewTransition(() => {
			fullscreen.value = !fullscreen.value;
		});
	}

	/**
	 * 给视频截个图。
	 * @param scale - 截图缩放比率，默认为 1。
	 * @returns 截图后的图片元素。
	 */
	async function getScreenshot(scale: number = 1) {
		if (!video.value) return;

		const canvas = document.createElement("canvas");
		canvas.width = video.value.clientWidth * scale;
		canvas.height = video.value.clientHeight * scale;
		canvas.getContext("2d")!.drawImage(video.value, 0, 0, canvas.width, canvas.height);

		const image = new Image();
		const blob = await new Promise<Blob>(resolve => canvas.toBlob(resolve as never));
		downloadFile(blob, `${props.title} (kv${props.videoId}) - ${new Duration(currentTime.value).toString()}`);
		return image;
	}

	provide("fullscreen", fullscreen);
</script>

<template>
	<Comp :class="{ fullscreen, dark: fullscreen }">
		<Modal v-model="showStats" icon="info" :title="t.player.stats" hideFooter>
			<Accordion class="stats">
				<AccordionItem title="Video File" shown noPadding>
					<table>
						<tbody>
							<tr>
								<td>Codec</td>
								<td>{{ statsVideo.codec }}</td>
							</tr>
							<tr>
								<td>Mime Type</td>
								<td>{{ statsVideo.mimeType }}</td>
							</tr>
							<tr>
								<td>Bit Rate</td>
								<td>{{ `${Math.round(statsVideo.bitRate / 1000)} Kbps` }}</td>
							</tr>
							<tr>
								<td>Resolution</td>
								<td>{{ `${statsVideo.resolution.width} × ${statsVideo.resolution.height}` }}</td>
							</tr>
							<tr>
								<td>Frame Rate</td>
								<td>{{ `${Number(statsVideo.frameRate.toFixed(3))} FPS` }}</td>
							</tr>
						</tbody>
					</table>
				</AccordionItem>
				<AccordionItem title="Audio File" shown noPadding>
					<table>
						<tbody>
							<tr>
								<td>Codec</td>
								<td>{{ statsAudio.codec }}</td>
							</tr>
							<tr>
								<td>Mime Type</td>
								<td>{{ statsAudio.mimeType }}</td>
							</tr>
							<tr>
								<td>Bit Rate</td>
								<td>{{ `${Math.round(statsAudio.bitRate / 1000)} Kbps` }}</td>
							</tr>
							<tr>
								<td>Sample Rate</td>
								<td>{{ `${statsAudio.sampleRate} Hz` }}</td>
							</tr>
						</tbody>
					</table>
				</AccordionItem>
				<AccordionItem title="Player" shown noPadding>
					<table>
						<tbody>
							<tr>
								<td>Core</td>
								<td>Shaka Player {{ playerVersion }}</td>
							</tr>
							<tr>
								<td>Manifest Type</td>
								<td>{{ statsPlayer.manifestType }}</td>
							</tr>
							<tr>
								<td>Estimated Bandwidth</td>
								<td>{{ `${Math.round(statsPlayer.estimatedBandwidth / 1000)} Kbps` }}</td>
							</tr>
							<tr>
								<td>Stream Bandwidth</td>
								<td>{{ `${Math.round(statsPlayer.streamBandwidth / 1000)} Kbps` }}</td>
							</tr>
							<tr>
								<td>Resolution</td>
								<td>{{ `${statsPlayer.resolution.width} × ${statsPlayer.resolution.height}` }}</td>
							</tr>
							<tr>
								<td>Frames</td>
								<td>{{ `${statsPlayer.frames.dropped} dropped of ${statsPlayer.frames.decoded}` }}</td>
							</tr>
						</tbody>
					</table>
				</AccordionItem>
			</Accordion>
		</Modal>

		<div ref="playerVideoMain" class="main" :class="{ 'hide-cursor': hideCursor, fullscreen }">
			<div class="screen">
				<video
					ref="video"
					class="player"
					:style="videoFilterStyle"
					@play="playing = true"
					@pause="playing = false"
					@ratechange="(video!.playbackRate !== 0) && (playbackRate = video!.playbackRate)"
					@timeupdate="onTimeUpdate"
					@canplay="onCanPlay"
					@progress="updateBuffered"
					@ended="ended = true"
					@waiting="waiting = true"
					@contextmenu.prevent="e => menu = e"
					@pointerup.left="onVideoPointerUp"
					@pointermove="autoHideController"
					:autoplay="settings.autoplay"
					playsinline
				></video>
				<Contents>
					<PlayerVideoDanmaku
						v-model="willSendDanmaku"
						:comments="initialDanmaku"
						:media="video"
						:hidden="!showDanmaku"
						:style="{ opacity: settings.danmaku.opacity }"
					/>
					<PlayerVideoSplash v-model="splash" />
					<div v-if="splash || waiting" class="waiting">
						<ProgressRing />
					</div>
					<PlayerVideoAbout v-model="showAboutPlayer" :playing />
				</Contents>
				<PlayerVideoTitle
					v-if="fullscreen"
					:title
					:hidden="hideController"
				/>
			</div>
			<PlayerVideoController
				:key="tracks.length"
				v-model:currentTime="currentTime"
				v-model:playing="playing"
				v-model:playbackRate="playbackRate"
				v-model:volume="volume"
				v-model:muted="muted"
				v-model:resample="resample"
				v-model:continuousRateControl="continuousRateControl"
				v-model:showDanmaku="showDanmaku"
				v-model:selectedTrack="selectedTrack"
				v-model:autoQuality="autoQuality"
				v-model:waiting="waiting"
				v-model:ended="ended"
				:duration
				:fullscreen="fullscreen"
				:toggleFullscreen
				:buffered
				:tracks
				:splash
				:settings
				:hidden="hideController"
				@mousedown="playerVideoControllerMouseDown = true"
				@touchstart.passive="onPlayerVideoControllerTouchStart"
				@touchend.passive="onPlayerVideoControllerTouchEnd"
				@focusin="hideController = false"
			/>
		</div>

		<div v-if="!isMobileWidth && !fullscreen" class="panel-container">
			<ClientOnly>
				<LazyPlayerVideoPanel
					v-model:insertDanmaku="willInsertDanmaku"
					:videoId
					:currentTime
					:playing
					:thumbnail
					:settings
				>
					<template #danmaku>
						<slot name="danmaku"></slot>
					</template>
				</LazyPlayerVideoPanel>

				<template #fallback>
					<div class="danmaku-loading">
						<LogoDanmakuLoading />
						<span>{{ t.danmaku.list.loading }}</span>
					</div>
				</template>
			</ClientOnly>
		</div>
		<Menu v-model="menu" noFade>
			<MenuItem icon="camera" @click="() => getScreenshot()">{{ t.player.screenshot }}</MenuItem>
			<MenuItem icon="info" @click="showStats = true">{{ t.player.stats }}</MenuItem>
			<hr />
			<MenuItem icon="yozora" class="version" @click="showAboutPlayer = true">YOZORA PLAYER</MenuItem>
		</Menu>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		// @include player-shadow;
		display: flex;
		flex-direction: row;

		&.fullscreen {
			position: fixed;
			inset: 0;
			z-index: 32;
		}
	}

	.main {
		position: relative;
		pointer-events: auto !important;
		view-transition-name: player-video-main;

		video {
			transition: none;
		}

		:comp:not(.fullscreen) & {
			&,
			& video {
				width: 100%;
			}

			& video {
				max-height: calc(100dvh - 36px - 26px * 2);
			}
		}

		.fullscreen & {
			@include square(100%);
			display: flex;
			flex-direction: column;

			.screen {
				height: 100dvh;
			}

			video {
				@include square(100%);
			}
		}

		&.hide-cursor {
			cursor: none;
		}
	}

	.panel-container {
		flex-shrink: 0;
		width: 350px;
		height: inherit;

		@include tablet {
			display: none;
		}
	}

	table {
		border-radius: 0;
	}

	.screen {
		position: relative;
		background-color: black;

		.contents {
			> * {
				position: absolute;
				inset: 0;
			}

			.waiting {
				@include flex-center;
				pointer-events: none;
			}
		}
	}

	.player-video-about {
		cursor: pointer;
	}

	.stats {
		flex-grow: 1;
		min-width: 320px;
		user-select: text;

		td {
			user-select: text;

			&:nth-of-type(2) {
				font-variant-numeric: tabular-nums;
				text-align: right;
			}
		}
	}

	.danmaku-loading {
		@include flex-center;
		flex-direction: column;
		gap: 12px;
		height: 100%;
		color: c(icon-color);

		.icon {
			color: c(accent);
			font-size: 48px;
		}
	}
</style>

<style lang="scss">
	$transition-duration: 500ms;

	::view-transition-old(player-video-main),
	::view-transition-new(player-video-main) {
		height: 100%;
		object-fit: cover;
		overflow: clip;
		animation-duration: 250ms;
	}

	:has(:comp)::view-transition-group(root) {
		animation: fade-from-black $transition-duration $ease-in-material-emphasized;
	}

	:has(:comp.fullscreen)::view-transition-group(root) {
		animation: fade-to-black $transition-duration $ease-in-out-material-emphasized;
	}

	::view-transition-group(player-video-main) {
		animation-duration: $transition-duration;
		animation-timing-function: $ease-in-out-material-emphasized;
	}

	@keyframes fade-to-black {
		to {
			filter: brightness(0);
		}
	}

	@keyframes fade-from-black {
		from {
			filter: brightness(0);
		}
	}
</style>
