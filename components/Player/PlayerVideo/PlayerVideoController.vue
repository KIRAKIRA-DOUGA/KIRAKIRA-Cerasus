<docs>
	# 视频播放器控制条
</docs>

<script setup lang="ts">
	import type shaka from "shaka-player";

	const props = withDefaults(defineProps<{
		/** 速度保持音高？ */
		preservesPitch?: boolean;
		/** 视频时长。 */
		duration?: number;
		/** 媒体缓冲加载进度秒数组。 */
		buffered?: Buffered;
		/** 是否全屏？ */
		fullscreen?: boolean;
		/** 切换全屏函数。 */
		toggleFullscreen?: (isFullbrowser?: boolean) => void;
		/** 视频轨道列表。 */
		tracks?: shaka.extern.Track[];
		/** 是否正在开屏加载。 */
		splash?: boolean;
		/** 视频播放器设置。 */
		settings?: PlayerVideoSettings;
		/** 是否隐藏？ */
		hidden?: boolean;
	}>(), {
		duration: NaN,
		buffered: undefined,
		fullscreen: false,
		toggleFullscreen: undefined,
		tracks: () => [],
	});

	/** 常用速度列表。 */
	const loopedPlaybackRates = [0.5, 1, 2];
	/** 有级速度列表。 */
	const steppedPlaybackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];

	const playing = defineModel<boolean>("playing", { default: false });
	const playbackRate = defineModel<number>("playbackRate", { default: 1 });
	const volume = defineModel<number>("volume", { default: 1 });
	const muted = defineModel<boolean>("muted", { default: false });
	const model = defineModel<number>("currentTime", { default: NaN });
	const resample = defineModel<boolean>("resample", { default: true });
	const continuousRateControl = defineModel<boolean>("continuousRateControl", { default: false });
	const showDanmaku = defineModel<boolean>("showDanmaku", { default: false });
	const waiting = defineModel<boolean>("waiting", { default: false });
	const ended = defineModel<boolean>("ended", { default: false });
	const selectedTrack = defineModel<shaka.extern.Track>("selectedTrack");
	const autoQuality = defineModel<boolean>("autoQuality", { default: true });
	const volumeBackup = ref(volume);
	const volumeSet = computed({
		get: () => muted.value ? 0 : volume.value,
		set: value => {
			muted.value = false;
			volume.value = value;
			volumeBackup.value = value;
		},
	});
	const playbackRateLinear = computed({
		get: () => Math.log2(playbackRate.value),
		set: value => {
			value = 2 ** value;
			if (!continuousRateControl.value) {
				const variances = steppedPlaybackRates.map(rate => (value - rate) ** 2);
				const minimum = Math.min(...variances);
				value = steppedPlaybackRates[variances.indexOf(minimum)];
			}
			playbackRate.value = value;
		},
	});
	const countdown = ref(false);

	const volumeMenu = ref<MenuModel>();
	const rateMenu = ref<MenuModel>();
	const qualityMenu = ref<MenuModel>();
	const tracksSorted = computed(() => props.tracks.sort((a, b) => (b.height || 0) - (a.height || 0)));

	const currentPercent = computed({
		get() {
			const result = model.value / props.duration;
			return Number.isFinite(result) ? result : 0;
		},
		set(percent) {
			const newTime = percent * props.duration;
			model.value = newTime;
		},
	});

	const currentTime = computed(() => new Duration(model.value).toString());
	const countdownTime = computed(() => new Duration(model.value - props.duration).toString());
	const duration = computed(() => new Duration(props.duration).toString());

	const mobile = () => getResponsiveDevice() === "mobile";

	/**
	 * 点击速度按钮时，在速度中循环。
	 */
	function switchSpeed() {
		let index = loopedPlaybackRates.indexOf(playbackRate.value);
		if (index === -1) {
			index = loopedPlaybackRates.indexOf(1);
			if (index === -1) throw new Error("在 playbackRates 速度列表中必须包含原速 1。");
		} else index = (index + 1) % loopedPlaybackRates.length;
		const newRate = loopedPlaybackRates[index];
		playbackRate.value = newRate;
	}

	/**
	 * 使用方向改变速度。
	 * @param increment - 增量方向，快放为 1，慢放为 -1。
	 */
	function switchSpeedByDirection(increment: 1 | -1) {
		showMenuByKeyboard(rateMenu);
		const rate = playbackRate.value;
		const rates = steppedPlaybackRates.slice();
		if (!rates.includes(rate)) {
			rates.push(rate);
			rates.sort();
		}
		const newRate = rates[rates.indexOf(rate) + increment];
		if (newRate === undefined) return;
		playbackRate.value = newRate;
	}

	/**
	 * 键盘控制显示浮窗菜单。
	 * @param menu - 菜单。
	 */
	function showMenuByKeyboard(menu: Ref<MenuModel | number | undefined>) {
		if (!isObject(menu.value))
			menu.value = new Date().valueOf();
	}

	const showFullbrowserBtn = ref(false);
	const hideFullbrowserTimeout = ref<Timeout>();

	/**
	 * 当指针移出全屏或网页全屏按钮时的事件。
	 */
	function onFullscreenBtnLeave() {
		hideFullbrowserTimeout.value = setTimeout(() => {
			showFullbrowserBtn.value = false;
		}, 100);
	}

	/**
	 * 获取当前轨道的帧率。
	 * @returns 当前轨道的帧率。
	 */
	function getCurrentFrameRate() {
		return selectedTrack.value?.frameRate;
	}

	/**
	 * 当指针移入全屏或网页全屏按钮时的事件。
	 */
	function onFullscreenBtnEnter() {
		clearTimeout(hideFullbrowserTimeout.value);
		useEvent("component:hideAllPlayerVideoMenu");
		showFullbrowserBtn.value = !props.fullscreen;
	}

	const playbackRateText = (rate: number) => (2 ** rate).toFixed(2).replace(/\.?0+$/, "") + "×";
	const volumeText = (volume: number) => Math.round(volume * 100) + "%";

	useEventListener("window", "keydown", e => {
		const VOLUME_TICK = 0.1, TIME_TICK = 5;
		switch (e.code) {
			case "ArrowUp": // 音量 +
				showMenuByKeyboard(volumeMenu);
				volume.value = clamp(volume.value + VOLUME_TICK, 0, 1);
				e.preventDefault();
				break;
			case "ArrowDown": // 音量 −
				showMenuByKeyboard(volumeMenu);
				volume.value = clamp(volume.value - VOLUME_TICK, 0, 1);
				e.preventDefault();
				break;
			case "ArrowRight":
				if (e.ctrlKey || e.metaKey) // 加速
					switchSpeedByDirection(1);
				else // 进度条 →
					model.value = clamp(model.value + TIME_TICK, 0, props.duration);
				e.preventDefault();
				break;
			case "ArrowLeft":
				if (e.ctrlKey || e.metaKey) // 减速
					switchSpeedByDirection(-1);
				else // 进度条 ←
					model.value = clamp(model.value - TIME_TICK, 0, props.duration);
				e.preventDefault();
				break;
			case "Escape":
				if (props.fullscreen)
					props.toggleFullscreen?.();
				e.preventDefault();
				break;
			case "Space": case "F11": /* 解决冲突 */ e.preventDefault(); break;
			default: break;
		}
	});

	useEventListener("window", "keyup", e => {
		switch (e.code) {
			case "KeyD": /* 弹幕 */ showDanmaku.value = !showDanmaku.value; break;
			case "KeyM": /* 静音 */ muted.value = !muted.value; showMenuByKeyboard(volumeMenu); break;
			case "KeyF": case "F11": /* 全屏 */ props.toggleFullscreen?.(); break;
			case "Space": /* 播放/暂停 */ playing.value = !playing.value; break;
			default: break;
		}
	});
</script>

<template>
	<div class="menus" v-bind="$attrs">
		<PlayerVideoMenu v-model="volumeMenu">
			<template #slider>
				<CapsuleSlider v-model="volumeSet" :min="0" :max="1" :displayValue="volumeText" :defaultValue="1" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-model="rateMenu">
			<menu @contextmenu.prevent>
				<ToggleSwitch v-model="resample" v-ripple.overlay icon="tunning">{{ t.player.speed.resample }}</ToggleSwitch>
				<ToggleSwitch v-model="continuousRateControl" v-ripple.overlay icon="speed">{{ t.player.speed.continuous }}</ToggleSwitch>
			</menu>
			<template #slider>
				<CapsuleSlider v-model="playbackRateLinear" :min="-2" :max="2" :displayValue="playbackRateText" :defaultValue="0" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-if="selectedTrack && selectedTrack.height" v-model="qualityMenu">
			<menu @contextmenu.prevent>
				<RadioOption
					v-for="track in tracksSorted"
					:key="track.id"
					:active="selectedTrack.height === track.height"
					@click="selectedTrack = track; autoQuality = false"
					class="quality-item"
				>
					<span>{{ track.height }}P</span>
					<span v-if="track.videoBandwidth" class="kbps">{{ Math.round(track.videoBandwidth / 1000) }} Kbps</span>
				</RadioOption>
			</menu>
			<menu @contextmenu.prevent>
				<ToggleSwitch v-model="autoQuality" v-ripple.overlay icon="network_check">{{ t.player.quality.auto }}</ToggleSwitch>
			</menu>
		</PlayerVideoMenu>
		<Transition v-if="!fullscreen">
			<div
				v-show="showFullbrowserBtn"
				class="fullbrowser"
				@pointerenter="e => isMouse(e) && onFullscreenBtnEnter()"
				@pointerleave="e => isMouse(e) && onFullscreenBtnLeave()"
			>
				<SoftButton icon="fullscreen_browser" @click="toggleFullscreen?.(true)" />
			</div>
		</Transition>
	</div>

	<Comp role="toolbar" :class="{ mobile: isMobile(), hidden }" v-bind="$attrs">
		<div class="left">
			<SoftButton class="play" :disabled="splash" :icon="ended ? 'replay' : playing ? 'pause' : 'play'" @click="playing = !playing" />
			<Transition>
				<div v-if="settings?.controller.showFrameByFrame" class="frame-by-frame">
					<SoftButton :disabled="splash || !getCurrentFrameRate()" icon="caret_left" @click="model -= (1 / getCurrentFrameRate()!)" />
					<SoftButton :disabled="splash || !getCurrentFrameRate()" icon="caret_right" @click="model += (1 / getCurrentFrameRate()!)" />
				</div>
			</Transition>
		</div>
		<div class="slider-wrapper">
			<Slider
				v-model="currentPercent"
				:min="0"
				:max="1"
				:buffered="buffered?.map(timeRanges => timeRanges.map(seconds => seconds / props.duration)) as Buffered"
				:waiting
				pending="cursor"
				:displayValue="pending => new Duration(pending * props.duration).toString()"
			/>
		</div>
		<div class="right">
			<div class="time" @click="countdown = !countdown">
				<span class="current">{{ countdown ? countdownTime : currentTime }} </span>
				<span class="divide">/</span>
				<span class="duration">{{ duration }}</span>
			</div>
			<SoftButton
				v-if="selectedTrack && selectedTrack.height"
				class="quality-button"
				:text="`${selectedTrack.height}P`"
				@pointerenter="e => isMouse(e) && (qualityMenu = e)"
				@pointerleave="e => isMouse(e) && (qualityMenu = undefined)"
				@click="e => mobile() && (qualityMenu = e)"
			/>
			<SoftButton
				icon="speed_outline"
				:active="playbackRate !== 1"
				@pointerenter="e => isMouse(e) && (rateMenu = e)"
				@pointerleave="e => isMouse(e) && (rateMenu = undefined)"
				@pointerup.left="e => isMouse(e) && switchSpeed()"
				@click="e => mobile() && (rateMenu = e)"
			/>
			<SoftButton
				:icon="muted ? 'volume_mute' : volumeSet >= 0.5 ? 'volume_up' : volumeSet > 0 ? 'volume_down' : 'volume_none'"
				class="volume"
				@pointerenter="e => isMouse(e) && (volumeMenu = e)"
				@pointerleave="e => isMouse(e) && (volumeMenu = undefined)"
				@pointerup.left="e => isMouse(e) && (muted = !muted)"
				@click="e => mobile() && (volumeMenu = e)"
			/>
			<!-- TODO: 音量图标需要修改为三根弧线，并且使用动画切换，参考 Windows 11 / i(Pad)OS 的动画。 -->
			<SoftButton
				:icon="showDanmaku ? 'danmaku' : 'danmaku_off'"
				@click="showDanmaku = !showDanmaku"
			/>
			<SoftButton
				:icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
				@pointerenter="e => isMouse(e) && onFullscreenBtnEnter()"
				@pointerleave="e => isMouse(e) && onFullscreenBtnLeave()"
				@click="toggleFullscreen?.()"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thickness: 36px;
	$twin-thickness: 60px;
	$ripple-fix-padding: calc(($thickness * (64px / 40px) - $thickness) / 2); // 修复水波纹切割，用于padding。
	$ripple-fix-margin: calc(($thickness * (64px / 40px) - $thickness) / -2); // 修复水波纹切割，用于margin。

	:comp {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		height: $thickness;
		color: c(icon-color);
		font-size: 14px;
		font-weight: 600;
		background-color: c(main-bg);

		.fullscreen & {
			@include acrylic-background;
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			backdrop-filter: blur(8px);
			transition: $fallback-transitions, background-color 0s;

			&.mobile {
				padding: 0 16px;
			}

			&.hidden {
				translate: 0 100%;
				visibility: hidden;
			}
		}

		@include mobile {
			flex-wrap: wrap;
			height: $twin-thickness;
		}

		:where(& > *) {
			flex-shrink: 0;
		}
	}

	.left {
		@include flex-center;
		justify-content: flex-start;
		height: inherit;
		padding-right: $ripple-fix-padding;

		overflow: clip;

		@include mobile {
			order: 2;
			height: $thickness;
		}

		.fullscreen & {
			margin-left: $ripple-fix-margin;
			padding-left: $ripple-fix-padding;
		}

		.play {
			width: $thickness + 10px;
		}

		.frame-by-frame {
			display: flex;
			width: $thickness * 2;
			margin-right: 6px;

			&.v-enter-from,
			&.v-leave-to {
				width: 0;
				margin-right: 0;
				scale: 0;
				opacity: 0;
			}
		}
	}

	.right {
		@include flex-center;
		justify-content: flex-end;
		height: inherit;
		overflow: clip;

		@include mobile {
			flex-grow: 1;
			order: 3;
			height: $thickness;
			margin-left: $ripple-fix-margin;
		}

		.fullscreen & {
			margin-right: $ripple-fix-margin;
			padding-right: $ripple-fix-padding;
		}

		button {
			@include square($thickness);
		}
	}

	.time {
		@include flex-center;
		min-width: 90px;
		margin: 0 4px;
		cursor: pointer;

		@include mobile {
			margin-right: auto;
		}

		> * {
			@include flex-center;
			font-variant-numeric: tabular-nums;
			text-align: center;
		}

		.current,
		.duration {
			flex-grow: 1;
		}

		.divide {
			padding: 0 2px;
		}
	}

	.slider-wrapper {
		flex-grow: 1;
		flex-shrink: 1;
		width: 100%;
		padding-right: 8px;

		@include mobile {
			order: 1;

			padding: 0 8px;

			.slider {
				height: 24px;
			}
		}

		@include not-mobile {
			margin-left: $ripple-fix-margin;
		}

		:deep(.passed) {
			opacity: 1;
		}
	}

	.visible {
		display: flex;
	}

	.menus {
		display: contents;

		@include mobile {
			& > * {
				translate: 0 -22px;
			}
		}

		.fullbrowser {
			@include round-small(top-left);
			position: absolute;
			right: 0;
			bottom: $thickness;
			overflow: clip;
			background-color: c(main-bg);

			&.v-enter-from,
			&.v-leave-to {
				translate: 0 100%;
			}
		}
	}

	.quality-item {
		&:deep(> span) {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
		}

		.kbps {
			color: c(icon-color);
			font-size: 12px;
			font-weight: normal;
			font-variant-numeric: tabular-nums;
			letter-spacing: 1;
		}
	}

	.soft-button {
		--wrapper-size: #{$thickness};

		&[aria-label="fullscreen"]:active:deep(.icon) {
			scale: 1.2;
		}

		&.quality-button:deep() {
			&,
			* {
				min-width: 60px;
			}
		}
	}
</style>
