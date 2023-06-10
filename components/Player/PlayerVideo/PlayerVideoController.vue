<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 速度保持音高？ */
		preservesPitch?: boolean;
		/** 视频时长。 */
		duration?: number;
		/** 缓冲加载进度值。 */
		buffered?: number;
		/** 切换全屏函数。 */
		toggleFullScreen?: Function;
	}>(), {
		duration: NaN,
		buffered: 0,
		toggleFullScreen: undefined,
	});

	const playing = defineModel<boolean>("playing");
	const playbackRate = defineModel<number>("playbackRate", { default: 1 });
	const model = defineModel<number>("currentTime", { default: NaN });
	const fullScreen = defineModel<boolean>("fullScreen");

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

	const playbackRateText = computed(() => playbackRate.value.toFixed(2).replace(/\.?0+$/, "") + "×");
</script>

<template>
	<Comp>
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
			<SoftButton icon="volume_up" />
			<SoftButton :text="playbackRateText" @click="switchSpeed" />
			<SoftButton :icon="fullScreen ? 'fullscreen' : 'fullscreen_exit'" @click="() => toggleFullScreen?.()" />
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$thickness: 36px;

	:comp {
		display: flex;
		align-items: center;
		height: $thickness;
		overflow: hidden;
		color: c(icon-color);
		font-weight: 600;
		font-size: 14px;

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
</style>
