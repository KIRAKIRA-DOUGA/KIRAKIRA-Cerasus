<docs>
	# 图标组件
	封装的总图标组件。如果下次想更换图标模块可直接在此处统一更换。
	目前的图标模块是 `vite-plugin-svg-icons`。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图标文件名称。 */
		name: string;
		/** 是否保持图标本身的颜色。 */
		filled?: boolean;
	}>(), {
		filled: false,
	});
</script>

<template>
	<span class="icon" :class="{ filled }">
		<svg aria-hidden="true">
			<use :xlink:href="`#icon-${name}`" />
		</svg>
	</span>
</template>

<style scoped lang="scss">
	.icon {
		@include square(1em);
		display: inline-flex;

		&:not(.filled) svg {
			fill: currentColor;
		}
	}
</style>
