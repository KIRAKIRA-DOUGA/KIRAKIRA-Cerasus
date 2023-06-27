<docs>
	# 黑幕 (Block text) (语自：萌娘百科)
	# 防剧透 (Spoiler) (语自：Telegram)

	本模板可以将幽默和恶搞内容用黑色或其他自定义颜色覆盖。阅读时，需要用鼠标选定才能显示。触屏设备上可以通过直接点击色块来阅读。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 彩幕背景色，默认为黑幕。 */
		color?: string;
		/** 工具提示。 */
		tooltip?: string;
	}>(), {
		color: "var(--text-color)",
		tooltip: "",
	});
</script>

<template>
	<span v-tooltip="tooltip || t.you_know_too_much" class="spoiler">
		<span class="text">
			<slot></slot>
		</span>
	</span>
</template>

<style scoped lang="scss">
	span:comp {
		@include round-small;
		color: c(main-bg);
		background-color: v-bind(color);

		.text:not(:hover) {
			opacity: 0;
		}

		.text > :deep(*) {
			color: inherit;

			* {
				background-color: v-bind(color);
			}
		}
	}
</style>
