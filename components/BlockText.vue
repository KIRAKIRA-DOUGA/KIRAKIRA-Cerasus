<docs>
	# 黑幕

	本模板可以将幽默和恶搞内容用黑色或其他自定义颜色覆盖。阅读时，需要用鼠标选定才能显示。触屏设备上可以通过直接点击色块来阅读。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		color?: string;
		tooltip?: string;
	}>(), {
		color: "var(--text-color)",
		tooltip: "",
	});
</script>

<template>
	<span class="block-text" :title="tooltip || t.you_know_too_much">
		<span class="text">
			<slot></slot>
		</span>
	</span>
</template>

<i18n lang="json5">
{
	zh: {
		you_know_too_much: "你知道的太多了。",
	},
	en: {
		you_know_too_much: "You know too much.",
	},
	ja: {
		you_know_too_much: "あなたは知っていることが多すぎます。",
	},
}
</i18n>

<style scoped lang="scss">
	.block-text {
		@include radius-small;
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
