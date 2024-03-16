<docs>
	# 视频播放器控制条
</docs>

<script setup lang="ts">
	import type { BitrateInfo } from "dashjs";

	const props = withDefaults(defineProps<{
		/** 速度保持音高？ */
		preservesPitch?: boolean;
		/** 视频时长。 */
		duration?: number;
		/** 缓冲加载进度值。 */
		buffered?: number;
		/** 切换全屏函数。 */
		toggleFullscreen?: () => void;
		/** 视频质量列表。 */
		qualities?: BitrateInfo[];
		/** 是否隐藏？ */
		hidden?: boolean;
		/**
		 * 进入全屏后强制深色的样式类声明。
		 *
		 * 注意：仅在设置页外观的示例控制条中，本属性可以为空。
		 */
		fullscreenColorClass?: Record<string, boolean>;
	}>(), {
		duration: NaN,
		buffered: 0,
		toggleFullscreen: undefined,
		qualities: () => [],
		fullscreenColorClass: () => ({}),
	});

	/** 常用速度列表。 */
	const loopedPlaybackRates = [0.5, 1, 2];
	/** 有级速度列表。 */
	const stepedPlaybackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4];

	const playing = defineModel<boolean>("playing", { default: false });
	const playbackRate = defineModel<number>("playbackRate", { default: 1 });
	const volume = defineModel<number>("volume", { default: 1 });
	const muted = defineModel<boolean>("muted", { default: false });
	const model = defineModel<number>("currentTime", { default: NaN });
	const fullscreen = defineModel<boolean>("fullscreen", { default: false });
	const resample = defineModel<boolean>("resample", { default: true });
	const steplessRate = defineModel<boolean>("steplessRate", { default: false });
	const showDanmaku = defineModel<boolean>("showDanmaku", { default: false });
	const waiting = defineModel<boolean>("waiting", { default: false });
	const ended = defineModel<boolean>("ended", { default: false });
	const quality = defineModel<string>("quality", { default: "720P" });
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
			if (!steplessRate.value) {
				const variances = stepedPlaybackRates.map(rate => (value - rate) ** 2);
				const minimum = Math.min(...variances);
				value = stepedPlaybackRates[variances.indexOf(minimum)];
			}
			playbackRate.value = value;
		},
	});
	const countdown = ref(false);

	const volumeMenu = ref<MenuModel>();
	const rateMenu = ref<MenuModel>();
	const qualityMenu = ref<MenuModel>();
	const qualities = computed(() => props.qualities.map(quality => quality.height + "P").sort().reverse());

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
	const buffered = computed(() => props.buffered / props.duration);

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
		const rates = stepedPlaybackRates.slice();
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
				if (e.ctrlKey) // 加速
					switchSpeedByDirection(1);
				else // 进度条 →
					model.value = clamp(model.value + TIME_TICK, 0, props.duration);
				e.preventDefault();
				break;
			case "ArrowLeft":
				if (e.ctrlKey) // 减速
					switchSpeedByDirection(-1);
				else // 进度条 ←
					model.value = clamp(model.value - TIME_TICK, 0, props.duration);
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

	/** 隐藏控制栏时隐藏菜单，用于触摸屏。 */
	watch(() => props.hidden, hidden => {
		if (!hidden) return;
		volumeMenu.value = undefined;
		rateMenu.value = undefined;
		qualityMenu.value = undefined;
	});
</script>

<template>
	<div class="menus" :class="{ ...fullscreenColorClass }" v-bind="$attrs">
		<PlayerVideoMenu v-model="volumeMenu">
			<template #slider>
				<CapsuleSlider v-model="volumeSet" :min="0" :max="1" :displayValue="volumeText" :defaultValue="1" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-model="rateMenu">
			<ToggleSwitch v-model="resample" v-ripple.overlay icon="tunning">{{ t.player.speed.resample }}</ToggleSwitch>
			<ToggleSwitch v-model="steplessRate" v-ripple.overlay icon="speed">{{ t.player.speed.continuous }}</ToggleSwitch>
			<template #slider>
				<CapsuleSlider v-model="playbackRateLinear" :min="-2" :max="2" :displayValue="playbackRateText" :defaultValue="0" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-model="qualityMenu">
			<RadioOption
				v-for="qual in qualities"
				:key="qual"
				:active="quality === qual"
				@click="quality = qual"
			>{{ qual }}</RadioOption>
		</PlayerVideoMenu>
	</div>

	<Comp role="toolbar" :class="{ fullscreen, ...fullscreenColorClass, mobile: isMobile(), hidden }" v-bind="$attrs">
		<div class="left">
			<SoftButton class="play" :icon="ended ? 'replay' : playing ? 'pause' : 'play'" @click="playing = !playing" />
		</div>
		<div class="slider-wrapper">
			<Slider
				v-model="currentPercent"
				:min="0"
				:max="1"
				:buffered
				:waiting
				pending="cursor"
				:displayValue="pending => new Duration(pending * props.duration).toString()"
			/>
		</div>
		<div class="time" @click="countdown = !countdown">
			<span class="current">{{ countdown ? countdownTime : currentTime }} </span>
			<span class="divide">/</span>
			<span class="duration">{{ duration }}</span>
		</div>
		<div class="right">
			<SoftButton
				class="quality-button"
				:text="quality"
				@mouseenter="e => qualityMenu = e"
				@mouseleave="qualityMenu = undefined"
			/>
			<SoftButton
				icon="speed_outline"
				@mouseenter="e => rateMenu = e"
				@mouseleave="rateMenu = undefined"
				@pointerup="e => isMouse(e) && switchSpeed()"
			/>
			<SoftButton
				:icon="muted ? 'volume_mute' : volumeSet >= 0.5 ? 'volume_up' : volumeSet > 0 ? 'volume_down' : 'volume_none'"
				class="volume"
				@mouseenter="e => volumeMenu = e"
				@mouseleave="volumeMenu = undefined"
				@pointerup="e => isMouse(e) && (muted = !muted)"
			/>
			<!-- TODO: 音量图标需要修改为三根弧线，并且使用动画切换，参考 Windows 11 / i(Pad)OS 的动画。 -->
			<SoftButton
				:icon="showDanmaku ? 'danmaku' : 'danmaku_off'"
				@click="showDanmaku = !showDanmaku"
			/>
			<SoftButton
				:icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
				@click="toggleFullscreen"
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
		// overflow: clip; // FIXME: Slider 的 Tooltip 是在 Slider 内的，打开 overflow: clip 会导致显示不出来。
		color: c(icon-color);
		font-weight: 600;
		font-size: 14px;
		background-color: c(main-bg);

		&.fullscreen {
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
				visibility: hidden;
				translate: 0 100%;
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
	}

	.right {
		@include flex-center;
		justify-content: flex-end;
		height: inherit;
		overflow: clip;

		@include mobile {
			order: 3;
			height: $thickness;
			margin-left: auto;
			padding-left: $ripple-fix-padding;

			.volume {
				display: none;
			}
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
			order: 2;
			margin-left: $ripple-fix-margin;
		}

		> * {
			@include flex-center;
			text-align: center;
			font-variant-numeric: tabular-nums;
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
	}

	.soft-button {
		--wrapper-size: #{$thickness};

		&:active:deep(.icon) {
			scale: 0.9;
		}

		&[aria-label="fullscreen"]:active:deep(.icon) {
			scale: 1.2;
		}

		&.quality-button:deep {
			&,
			* {
				min-width: 55px;
			}
		}
	}
</style>
