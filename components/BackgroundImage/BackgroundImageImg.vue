<script lang="ts">
	export const fitTypes = {
		cover: "cover",
		contain: "contain",
		original: "none",
		stretch: "fill",
		scaleDown: "scale-down",
		tile: "tile",
		tileContain: "tile contain",
	} as const;
</script>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图像地址。 */
		src: string;
		/** 允许屏幕阅读器自动在线获取图像 a11y 描述？ @default false */
		autoAlt?: boolean;
		/** 适应类型。 */
		fit?: keyof typeof fitTypes;
		/** 图像位置（X 和 Y 的百分比）。 */
		position?: TwoD;
		/** 图像替代文本。 */
		alt?: string;
	}>(), {
		autoAlt: false,
		fit: "cover",
		position: () => [50, 50],
	});

	const isTile = computed(() => props.fit.includes("tile"));
	const cssFit = computed(() => fitTypes[props.fit] as CSSProperties["objectFit"]);
</script>

<template>
	<img
		:alt="alt || (autoAlt ? undefined : '')"
		:src
		:class="cssFit"
		:style="{
			backgroundImage: isTile ? `url('${src}')` : undefined,
			objectFit: !isTile ? cssFit : undefined,
			'--position': `${position[0]}% ${position[1]}%`,
		}"
	/>
</template>

<style scoped lang="scss">
	img {
		@include square(100%);
		object-position: var(--position) !important;
		background-repeat: repeat;
		background-position: var(--position) !important;

		&.tile {
			content-visibility: hidden;

			&.contain {
				background-size: contain;
			}
		}
	}
</style>
