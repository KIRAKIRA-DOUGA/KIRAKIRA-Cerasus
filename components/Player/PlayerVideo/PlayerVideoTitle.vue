<docs>
	仅在视频全屏时在顶部显示视频的标题以及当前时间。
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 视频标题。 */
		title: string;
		/** 是否隐藏？ */
		hidden?: boolean;
	}>();

	import { useNow, useBattery } from "@vueuse/core";
	const now = useNow();
	const time = computed(() => Intl.DateTimeFormat(getCurrentLocaleLangCode(), {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		hourCycle: "h23",
	}).format(now.value));

	const { charging, level, isSupported: hasBattery } = useBattery();
	const battery = computed(() => {
		let text = Math.round(level.value * 100) + "%";
		if (charging.value) text += "(充电中)"; // TODO: 应该改成电池和充电的图标。
		return text;
	});
</script>

<template>
	<Comp :class="{ hidden }">
		<div class="left">
			<h3 class="title">{{ title }}</h3>
		</div>
		<div class="right">
			<p v-if="hasBattery" class="battery">{{ battery }}</p>
			<p class="time">{{ time }}</p>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include acrylic-background;
		position: absolute;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 8px 20px;
		backdrop-filter: blur(8px);
		transition: $fallback-transitions, background-color 0s;
		pointer-events: none;

		&.hidden {
			translate: 0 -100%;
			visibility: hidden;
		}
	}

	.title {
		font-weight: bold;
		font-size: 16px;
	}

	.right {
		display: flex;
		gap: 0.75em;
		align-items: baseline;

		.time,
		.battery {
			font-variant-numeric: tabular-nums;
		}
	}
</style>
