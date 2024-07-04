<docs>
	# YOZORA PLAYER
	视频播放器。
</docs>

<script setup lang="ts">
	import mediainfo from "mediainfo.js";
	import type { MediaPlayerClass, BitrateInfo } from "dashjs";
	import { createDanmakuComment } from "./PlayerVideoPanel/PlayerVideoPanelDanmaku/PlayerVideoPanelDanmakuSender.vue";

	const props = defineProps<{
		/** 视频源。 */
		src: string;
		/** 视频 ID。 */
		id: number;
		/** 视频评分。 */
		rating: number;
		/** 视频标题。 */
		title: string;
		/** 视频封面地址。 */
		thumbnail: string;
	}>();

	const playing = ref(false);
	const playbackRate = ref(1);
	const preservesPitch = ref(false);
	const continuousRateControl = ref(false);
	const volume = ref(1);
	const muted = ref(false);
	const currentTime = ref(NaN);
	const duration = ref(NaN);
	const buffered = ref(0);
	const isTimeUpdating = ref(false);
	const ended = ref(false);
	const waiting = ref(true);
	const showMediaInfo = ref(false);
	const showAboutPlayer = ref(false);
	const currentQuality = ref("720P");
	const settings = reactive<PlayerVideoSettings>({
		danmaku: {
			fontSizeScale: 1,
			opacity: 1,
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
		if (filters.length) style.filter = filters.join(" ");
		return style;
	});

	const qualities = ref<BitrateInfo[]>([]);
	const mediaInfos = ref<MediaInfo>();
	const video = ref<HTMLVideoElement>();
	const playerVideoMain = ref<HTMLDivElement>();
	const { exit: exitFullscreen, enter: enterFullscreen } = useFullscreen();
	const fullscreen = ref(false); // 是否独占整个浏览器画面？
	const resample = computed({ get: () => !preservesPitch.value, set: value => preservesPitch.value = !value });
	const menu = ref<MenuModel>();
	const showDanmaku = ref(true);
	const showProgressRing = ref(true);
	const showProgressRingTimeoutId = ref<Timeout>();
	const hideController = ref(false);
	const hideControllerTimeoutId = ref<Timeout>();
	const hideCursor = ref(false);
	const hideCursorTimeoutId = ref<Timeout>();
	const dblClickCount = ref(0);
	const dblClickTimeoutId = ref<Timeout>();
	const willSendDanmaku = ref<DanmakuComment[]>();
	const willInsertDanmaku = ref<DanmakuListItem[]>();
	const initialDanmaku = ref<DanmakuComment[]>();
	const screenOrientationBeforeFullscreen = ref<OrientationType>("portrait-primary");
	const playerVideoControllerMouseDown = ref(false);
	type MediaInfo = Record<string, Record<string, unknown>>;
	const playerConfig = useAppSettingsStore().player;

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
		const tracks = result.media?.track ?? [];
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
		if (!video.value) return;
		video.value.volume = volume ** 2; // 使用对数音量。
		playerConfig.audio.volume = volume;
	});

	watch(muted, muted => {
		if (!video.value) return;
		video.value.muted = muted;
		playerConfig.audio.muted = muted;
	});

	watch(waiting, waiting => {
		if (waiting) {
			clearTimeout(showProgressRingTimeoutId.value);
			showProgressRingTimeoutId.value = setTimeout(() => showProgressRing.value = true, 1000);
		} else {
			clearTimeout(showProgressRingTimeoutId.value);
			showProgressRing.value = false;
		}
	});

	watch(() => settings.danmaku.opacity, opacity => {
		playerConfig.danmaku.opacity = opacity;
	});

	watch(() => settings.danmaku.fontSizeScale, size => {
		playerConfig.danmaku.fontSizeScale = size;
	});

	watch(fullscreen, fullscreen => {
		try { // 全屏时请求横屏。在设备不支持或安全问题时有可能会报错。
			if (fullscreen) {
				if (isMobile()) {
					screenOrientationBeforeFullscreen.value = screen.orientation.type;
					screen.orientation.lock("landscape");
				}
				autoHideController(); // 进入全屏后自动开始隐藏控制栏计时。
			} else {
				if (isMobile()) {
					screen.orientation.lock(screenOrientationBeforeFullscreen.value);
					screen.orientation.unlock();
				}
				hideController.value = false; // 退出全屏时确保显示播放器控制栏。
			}
		} catch { }
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
			const getDanmakuByKvidRequest: GetDanmakuByKvidRequestDto = { videoId: props.id };
			const danmakuListResult = await api.danmaku.getDanmakuByKvid(getDanmakuByKvidRequest);

			if (danmakuListResult.success && danmakuListResult.danmaku && danmakuListResult.danmaku.length > 0) {
				// 初始化视频上的弹幕列表
				initialDanmaku.value = danmakuListResult.danmaku.map(danmaku => ({
					text: danmaku.text,
					mode: danmaku.mode,
					time: danmaku.time,
					style: {
						fontSize: `${fontSizes[danmaku.fontSIze]}px`,
						color: `#${danmaku.color}`,
						textShadow: "-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000",
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
			useToast("获取弹幕列表失败", "error"); // TODO: 使用多语言
			console.error("ERROR", "获取弹幕列表失败");
		}
	}
	watch(() => props.id, fetchDanmaku, { immediate: true });

	watch(willSendDanmaku, danmaku => {
		if (danmaku)
			willInsertDanmaku.value = danmaku.map(e => ({
				videoTime: new Duration(e.time ?? currentTime.value),
				content: e.text!,
				sendTime: new Date(), // TODO: Get when did the danmaku send.
			}));
	});

	const player = ref<MediaPlayerClass>();

	onMounted(async () => {
		if (!video.value) return;
		onCanPlay({ target: video.value });

		if (props.src.endsWith(".mp4"))
			video.value.src = props.src;
		else if (environment.client) {
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

			// BUG: Dash.js will raise an error: [614][FragmentController] TypeError: Cannot read properties of undefined (reading 'append')
		}

		// 从 Pinia 中取出保存的设置。
		volume.value = playerConfig.audio.volume;
		muted.value = playerConfig.audio.muted;
		preservesPitch.value = playerConfig.rate.preservesPitch;
		continuousRateControl.value = playerConfig.rate.continuousControl;
		settings.danmaku.opacity = playerConfig.danmaku.opacity;
		settings.danmaku.fontSizeScale = playerConfig.danmaku.fontSizeScale;
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
		waiting.value = false;
	}

	const quality = computed({
		get: () => currentQuality.value,
		set: quality => {
			// TODO: CRINGE ALERT COPY PASTA
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
		ended.value = false;
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
		downloadFile(blob, `${props.title} (kv${props.id}) - ${new Duration(currentTime.value).toString()}`);
		return image;
	}
</script>

<template>
	<Comp :class="{ fullscreen, dark: fullscreen }">
		<Modal v-model="showMediaInfo" icon="info" title="视频详细信息">
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
		</Modal>

		<div ref="playerVideoMain" class="main" :class="{ 'hide-cursor': hideCursor, fullscreen }">
			<div class="screen">
				<video
					ref="video"
					class="player"
					:style="videoFilterStyle"
					@play="playing = true"
					@pause="playing = false"
					@ratechange="e => playbackRate = (e.target as HTMLVideoElement).playbackRate"
					@timeupdate="onTimeUpdate"
					@canplay="onCanPlay"
					@progress="onProgress"
					@ended="ended = true"
					@waiting="waiting = true"
					@contextmenu.prevent="e => menu = e"
					@pointerup.left="onVideoPointerUp"
					@pointermove="autoHideController"
				></video>
				<Contents>
					<PlayerVideoDanmaku
						v-model="willSendDanmaku"
						:comments="initialDanmaku"
						:media="video"
						:hidden="!showDanmaku"
						:style="{ opacity: settings.danmaku.opacity }"
					/>
					<div v-if="showProgressRing" class="waiting">
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
				:key="qualities.length"
				v-model:currentTime="currentTime"
				v-model:playing="playing"
				v-model:playbackRate="playbackRate"
				v-model:volume="volume"
				v-model:muted="muted"
				v-model:resample="resample"
				v-model:continuousRateControl="continuousRateControl"
				v-model:showDanmaku="showDanmaku"
				v-model:quality="quality"
				v-model:waiting="waiting"
				v-model:ended="ended"
				:duration
				:fullscreen="fullscreen"
				:toggleFullscreen
				:buffered
				:qualities
				:hidden="hideController"
				@mousedown="playerVideoControllerMouseDown = true"
				@touchstart="onPlayerVideoControllerTouchStart"
				@touchend="onPlayerVideoControllerTouchEnd"
				@focusin="hideController = false"
			/>
		</div>

		<PlayerVideoPanel
			v-if="!fullscreen"
			v-model:sendDanmaku="willSendDanmaku"
			v-model:insertDanmaku="willInsertDanmaku"
			:videoId="id"
			:currentTime
			:rating
			:playing
			:thumbnail
			:settings
		/>
		<Menu v-model="menu">
			<MenuItem icon="camera" @click="() => getScreenshot()">截取当前画面</MenuItem>
			<!-- TODO: 使用其他方式而非下载完整视频后获取信息，B站是怎么做的呢？ -->
			<MenuItem icon="info" @click="showInfo">查看视频详细信息</MenuItem>
			<hr />
			<MenuItem icon="yozora" class="version" @click="showAboutPlayer = true">YOZORA PLAYER</MenuItem>
		</Menu>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include player-shadow;
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
		background-color: black;
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

	table {
		border-radius: 0;
	}

	.menu-item {
		color: c(text-color) !important; // 避免黑底视频看不清文字。
	}

	.screen {
		position: relative;

		.contents {
			> * {
				position: absolute;
				inset: 0;
			}

			.waiting {
				@include flex-center;
				pointer-events: none;

				.progress-ring {
					--size: 56px;
					--thickness: 6px;
				}
			}
		}
	}

	.player-video-about {
		cursor: pointer;
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
