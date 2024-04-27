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
	const battery = computed(() => Math.round(level.value * 100) + "%");
</script>

<template>
	<Comp :class="{ hidden }">
		<div class="left">
			<h3 class="title">{{ title }}</h3>
		</div>
		<div class="right">
			<div v-if="hasBattery" class="battery">
				<p class="battery-text">{{ battery }}</p>
				<LogoBattery :value="level" :charging />
			</div>
			<time :datetime="now.toISOString()">{{ time }}</time>
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
		color: c(icon-color);
		backdrop-filter: blur(8px);
		transition: $fallback-transitions, background-color 0s;
		pointer-events: none;

		&.hidden {
			visibility: hidden;
			translate: 0 -100%;
		}
	}

	.title {
		font-weight: bold;
		font-size: 16px;
	}

	.right {
		display: flex;
		gap: 0.75em;
		align-items: center;

		.icon {
			font-size: 18px;
		}

		time,
		.battery-text {
			font-variant-numeric: tabular-nums;
			font-weight: 500;
		}

		.battery {
			display: flex;
			gap: 2px;
			align-items: center;
		}
	}
</style>
