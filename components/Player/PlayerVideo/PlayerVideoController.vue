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

	const playing = defineModel<boolean>("playing");
	const playbackRate = defineModel<number>("playbackRate", { default: 1 });
	const volume = defineModel<number>("volume", { default: 1 });
	const muted = defineModel<boolean>("muted", { default: false });
	const model = defineModel<number>("currentTime", { default: NaN });
	const fullscreen = defineModel<boolean>("fullscreen");
	const resample = defineModel<boolean>("resample", { default: true });
	const steplessRate = defineModel<boolean>("steplessRate", { default: true });
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
		set: value => playbackRate.value = 2 ** value,
	});

	const volumeMenu = ref<MenuModel>();
	const rateMenu = ref<MenuModel>();

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

	/** 常用速度列表。 */
	const playbackRates = [0.5, 1, 2];

	/**
	 * 点击速度按钮时，在速度中循环。
	 */
	function switchSpeed() {
		let index = playbackRates.indexOf(playbackRate.value);
		if (index === -1) {
			index = playbackRates.indexOf(1);
			if (index === -1) throw new Error("在 playbackRates 速度列表中必须包含原速 1。");
		} else index = (index + 1) % playbackRates.length;
		const newRate = playbackRates[index];
		playbackRate.value = newRate;
	}

	const playbackRateText = computed(() => playbackRate.value.toFixed(2).replace(/\.?0+$/, "") + "×");
	const volumeText = computed(() => (volumeSet.value * 100 | 0) + "%");

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
	<div class="menus">
		<PlayerVideoMenu v-model="volumeMenu">
			<template #slider>
				<CapsuleSlider v-model="volumeSet" :min="0" :max="1" :displayValue="volumeText" :defaultValue="1" />
			</template>
		</PlayerVideoMenu>
		<PlayerVideoMenu v-model="rateMenu">
			<ToggleSwitch v-model="resample" icon="placeholder">重采样音频</ToggleSwitch>
			<ToggleSwitch v-model="steplessRate" icon="placeholder">无级变速</ToggleSwitch>
			<template #slider>
				<CapsuleSlider v-model="playbackRateLinear" :min="-2" :max="2" :displayValue="playbackRateText" :defaultValue="0" />
			</template>
		</PlayerVideoMenu>
	</div>

	<Comp role="toolbar" :class="{ fullscreen, 'force-color dark': fullscreen }">
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
				:text="playbackRateText"
				@click="switchSpeed"
				@mouseenter="e => rateMenu = e"
				@mouseleave="rateMenu = undefined"
			/>
			<SoftButton
				:icon="volumeSet ? 'volume_up' : 'volume_mute'"
				@click="muted = !muted"
				@mouseenter="e => volumeMenu = e"
				@mouseleave="volumeMenu = undefined"
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
			background-color: transparent;
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
