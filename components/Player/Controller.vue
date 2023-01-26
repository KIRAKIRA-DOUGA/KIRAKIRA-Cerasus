<script setup lang="ts">
	const props = withDefaults(defineProps<{
		playing?: boolean;
		playbackRate?: number;
		preservesPitch?: boolean;
		currentTime?: number;
		duration?: number;
		fullScreen?: boolean;
	}>(), {
		playbackRate: 1,
		currentTime: NaN,
		duration: NaN,
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
			return isFinite(result) ? result : 0;
		},
		set(percent) {
			const newTime = percent * props.duration;
			emits("update:currentTime", newTime);
		},
	});

	/**
	 * 将秒数转换为（时）分秒字符串。其中小时数如为 0 时省略。
	 * @param time - 秒数。
	 * @returns （时）分秒字符串。
	 */
	function convertTime(time: number): string {
		if (!isFinite(time)) return "--:--"; // 当没有时间数据时显示占位符字符串。
		const padStart = (s: string | number) => String(s).padStart(2, "0");
		time |= 0; // 去掉小数（毫秒值等）。
		const seconds = time % 60;
		const minutes = time / 60 % 60 | 0;
		let hms = `${padStart(minutes)}:${padStart(seconds)}`;
		const hours = time / 60 / 60 % 60 | 0;
		if (hours !== 0) hms = `${padStart(hours)}:` + hms;
		return hms;
	}

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
		}
		index = (index + 1) % playbackRates.length;
		const newRate = playbackRates[index];
		emits("update:playbackRate", newRate);
	}

	const playbackRateText = computed(() => props.playbackRate.toFixed(2).replace(/\.?0+$/, "") + "×");
</script>

<template>
	<section class="video-controller">
		<PlayerButton :icon="playing ? 'pause' : 'play'" @click="emits('update:playing', !playing)" />
		<div class="slidebar">
			<SlideBar v-model="currentPercent" :min="0" :max="1" />
		</div>
		<span>{{ convertTime(currentTime) }} / {{ convertTime(duration) }}</span>
		<PlayerButton :text="playbackRateText" @click="switchSpeed" />
		<PlayerButton icon="full_screen" @click="emits('update:fullScreen', !fullScreen)" />
	</section>
</template>

<style scoped lang="scss">
	section.video-controller { // 完蛋了，垃圾 Vue 样式泄漏了。
		display: flex;
		gap: 4px;
		align-items: center;
		height: 36px;
		color: c(icon-color);
		font-weight: 600;
		font-size: 14px;

		:where(& > *) {
			flex-shrink: 0;
		}
	}

	.slidebar {
		flex-shrink: 1;
		width: 100%;
	}
</style>
