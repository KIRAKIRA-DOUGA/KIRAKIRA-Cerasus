<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 速度保持音高？ */
		preservesPitch?: boolean;
		/** 视频时长。 */
		duration?: number;
		/** 缓冲加载进度值。 */
		buffered?: number;
		/** 切换全屏函数。 */
		toggleFullscreen?: Function;
	}>(), {
		duration: NaN,
		buffered: 0,
		toggleFullscreen: undefined,
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

	const volumeMenu = ref<MenuModel>();
	const rateMenu = ref<MenuModel>();
	const resolutionMenu = ref<MenuModel>();
	const fullscreenColorClass = computed(() => ({ [`force-color dark ${Theme.palette.value}`]: fullscreen.value }));

	const [resolution, resolutionOptions] = defineMenuOptions(["4K", "1080P", "720P", "480P", "360P"], "1080P");

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

	const playbackRateText = (rate: number) => (2 ** rate).toFixed(2).replace(/\.?0+$/, "") + "×";
	const volumeText = (volume: number) => Math.round(volume * 100) + "%";

	/**
	 * 创建一组菜单选项。
	 * @param options - 选项们。
	 * @param def - 默认值。
	 * @returns 引用响应式变量。
	 */
	function defineMenuOptions<const T>(options: T[], def: T) {
		const value = ref<T>(def) as Ref<T>;

		const list = reactive(options.map(option => {
			if (option === undefined || option === null) return undefined!;
			const _option = option as object;
			const key = typeof _option === "object" && "key" in _option ? _option.key as string : _option.toString();
			const active = computed(() => value.value === option);
			return { data: option, key, active, onChange: () => value.value = option };
		}).filter(option => option));

		return [value, list] as const;
	}

	/**
	 * Forces volume slider visibility during interaction
	 */
	/* function volumePointerDown() {
		isVolumeSliderActive.value = true;

		const pointerUp = () => {
			isVolumeSliderActive.value = false;
			document.removeEventListener("pointerup", pointerUp);
		};
		document.addEventListener("pointerup", pointerUp);
	} */
</script>

<template>
	<div class="menus" :class="{ ...fullscreenColorClass }">
		<PlayerVideoMenu v-model="volumeMenu">
			<template #slider>
				<CapsuleSlider v-model="volumeSet" :min="0" :max="1" :displayValue="volumeText" :defaultValue="1" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-model="rateMenu">
			<ToggleSwitch v-model="resample" v-ripple icon="tunning">重采样音频</ToggleSwitch>
			<ToggleSwitch v-model="steplessRate" v-ripple icon="speed">无级变速</ToggleSwitch>
			<template #slider>
				<CapsuleSlider v-model="playbackRateLinear" :min="-2" :max="2" :displayValue="playbackRateText" :defaultValue="0" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-model="resolutionMenu">
			<RadioOption
				v-for="option in resolutionOptions"
				:key="option"
				:active="option.active"
				@click="option.onChange"
			>{{ option.data }}</RadioOption>
		</PlayerVideoMenu>
	</div>

	<Comp role="toolbar" :class="{ fullscreen, ...fullscreenColorClass }">
		<div class="left">
			<SoftButton class="play" :icon="playing ? 'pause' : 'play'" @click="playing = !playing" />
		</div>
		<div class="slider">
			<Slider v-model="currentPercent" :min="0" :max="1" :buffered="buffered" />
		</div>
		<div class="right">
			<div class="time">
				<span class="current">{{ currentTime }} </span>
				<span class="divide">/</span>
				<span class="duration">{{ duration }}</span>
			</div>
			<SoftButton
				:text="resolution"
				@mouseenter="e => resolutionMenu = e"
				@mouseleave="resolutionMenu = undefined"
			/>
			<SoftButton
				icon="speed_outline"
				@click="switchSpeed"
				@mouseenter="e => rateMenu = e"
				@mouseleave="rateMenu = undefined"
			/>
			<SoftButton
				:icon="volumeSet >= 0.5 ? 'volume_up' : volumeSet > 0 ? 'volume_down' : 'volume_mute'"
				@click="muted = !muted"
				@mouseenter="e => volumeMenu = e"
				@mouseleave="volumeMenu = undefined"
			/>
			<!-- TODO: 音量图标需要修改为三根弧线，并且使用动画切换，参考 Windows 11 / i(Pad)OS 的动画。 -->
			<SoftButton
				:icon="showDanmaku ? 'danmaku' : 'danmaku_off'"
				@click="showDanmaku = !showDanmaku"
			/>
			<SoftButton
				:icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
				@click="() => toggleFullscreen?.()"
			/>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thickness: 36px;

	:comp {
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		height: $thickness;
		overflow: hidden;
		color: c(icon-color);
		font-weight: 600;
		font-size: 14px;
		background-color: c(main-bg);

		&.fullscreen {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			background-color: transparent;
			transition: $fallback-transitions, background-color 0s;
		}

		:where(& > *) {
			flex-shrink: 0;
		}
	}

	.left {
		@include flex-center;
		justify-content: flex-start;
		height: inherit;

		.play {
			width: $thickness + 10px;
		}
	}

	.right {
		@include flex-center;
		justify-content: flex-end;
		height: inherit;

		button {
			@include square($thickness);
		}
	}

	.time {
		@include flex-center;
		min-width: 90px;
		margin: 0 4px;

		> * {
			@include flex-center;
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

	.slider {
		flex-grow: 1;
		flex-shrink: 1;
		width: 100%;
	}

	.visible {
		display: flex;
	}

	.menus {
		display: contents;
	}
</style>
