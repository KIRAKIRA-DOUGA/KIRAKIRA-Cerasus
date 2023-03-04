<script setup lang="ts">
	const props = withDefaults(defineProps<{
		playing?: boolean;
		playbackRate?: number;
		preservesPitch?: boolean;
		currentTime?: number;
		duration?: number;
		fullScreen?: boolean;
		toggleFullScreen?: Function;
	}>(), {
		playbackRate: 1,
		currentTime: NaN,
		duration: NaN,
		toggleFullScreen: undefined,
	});

	const emits = defineEmits<{
		(event: "update:currentTime", currentTime: number): void;
		(event: "update:playing", isPlaying: boolean): void;
		(event: "update:fullScreen", isFullScreen: boolean): void;
		(event: "update:playbackRate", playbackRate: number): void;
	}>();

	const currentPercent = computed({
		get() {
			const result = props.currentTime / props.duration;
			return Number.isFinite(result) ? result : 0;
		},
		set(percent) {
			const newTime = percent * props.duration;
			emits("update:currentTime", newTime);
		},
	});

	const currentTime = computed(() => new Duration(props.currentTime).toString());
	const duration = computed(() => new Duration(props.duration).toString());

	/**
	 * 常用速度列表。
	 */
	const playbackRates = [0.5, 1, 2];

	/**
	 * 点击速度按钮时，在速度中循环。
	 */
	function switchSpeed() {
		let index = playbackRates.indexOf(props.playbackRate);
		if (index === -1) {
			index = playbackRates.indexOf(1);
			if (index === -1) throw new Error("在 playbackRates 速度列表中必须包含原速 1。");
		} else index = (index + 1) % playbackRates.length;
		const newRate = playbackRates[index];
		emits("update:playbackRate", newRate);
	}

	const playbackRateText = computed(() => props.playbackRate.toFixed(2).replace(/\.?0+$/, "") + "×");
</script>

<template>
	<kira-component class="player-video-controller">
		<div class="left">
			<PlayerButton class="play" :icon="playing ? 'pause' : 'play'" @click="emits('update:playing', !playing)" />
		</div>
		<div class="slider">
			<Slider v-model="currentPercent" :min="0" :max="1" />
		</div>
		<div class="right">
			<div class="time">
				<span class="current">{{ currentTime }} </span>
				<span class="divide">/</span>
				<span class="duration">{{ duration }}</span>
			</div>
			<PlayerButton :text="playbackRateText" @click="switchSpeed" />
			<PlayerButton icon="fullscreen" @click="() => toggleFullScreen?.()" />
		</div>
	</kira-component>
</template>

<style scoped lang="scss">
	$thickness: 36px;

	.player-video-controller {
		display: flex;
		align-items: center;
		height: $thickness;
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

			.icon {
				font-size: 28px;
			}
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
