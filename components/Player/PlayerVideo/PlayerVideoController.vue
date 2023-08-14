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
	const model = defineModel<number>("currentTime", { default: NaN });
	const fullscreen = defineModel<boolean>("fullscreen");

	const isVolumeSliderActive = ref(false);

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
	 * 常用速度列表。
	 */
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

	/**
	 * Mute or unmute volume depending on current state.
	 */
	function toggleVolume() {
		volume.value = volume.value ? 0 : 1;
	}

	const playbackRateText = computed(() => playbackRate.value.toFixed(2).replace(/\.?0+$/, "") + "×");

	/**
	 * @param value - number from PlayerRangeControl
	 * @returns string formatted value to display in UI
	 */
	function getDisplayValue(value: number): string {
		return `${Math.floor(value * 100)}%`;
	}

	/**
	 * Forces volume slider visibility during interaction
	 */
	function volumePointerDown() {
		isVolumeSliderActive.value = true;

		const pointerUp = () => {
			isVolumeSliderActive.value = false;
			document.removeEventListener("pointerup", pointerUp);
		};
		document.addEventListener("pointerup", pointerUp);
	}

	const forceVolumeSliderVisible = computed(() => isVolumeSliderActive.value);
</script>

<template>
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
			<div class="volume-container">
				<SoftButton :icon="volume ? 'volume_up' : 'volume_mute'" @click="toggleVolume" />
				<div :class="['volume-slider-container', { visible: forceVolumeSliderVisible }]" @pointerdown="volumePointerDown">
					<div class="volume-slider">
						<PlayerRangeControl v-model="volume" :min="0" :max="1" :getDisplayValue="getDisplayValue" />
					</div>
				</div>
			</div>
			<SoftButton :text="playbackRateText" @click="switchSpeed" />
			<SoftButton :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="() => toggleFullscreen?.()" />
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thickness: 36px;

	.volume-container {
		position: relative;
	}

	.volume-slider-container {
		position: absolute;
		bottom: 100%;
		left: 50%;
		display: none;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem;
		transform: translateX(-50%);
	}

	.volume-slider-value {
		display: none;
	}

	.volume-slider-container:focus-within .volume-slider-value {
		display: block;
	}

	.volume-slider {
		flex: 1 1;
		width: 160px;
	}

	.volume-container:hover .volume-slider-container {
		display: flex;
	}

	:comp {
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
</style>
