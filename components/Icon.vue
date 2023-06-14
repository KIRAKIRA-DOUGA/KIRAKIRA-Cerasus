<docs>
	# 图标组件
	封装的总图标组件。如果下次想更换图标模块可直接在此处统一更换。
	目前的图标模块是 `nuxt-icons`。
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
	<span class="icon" role="img" :aria-label="new VariableName(name).words">
		<NuxtIcon :name="name" :filled="filled" />
	</span>
</template>

<style scoped lang="scss">
	.icon {
		@include square(1em);
		display: inline-flex;

		> .nuxt-icon {
			@include square(1em);
			display: inline-flex;
			align-items: center;
			justify-content: center;

			> :deep(svg) {
				margin-bottom: 0 !important;
			}
		}
	}
</style>
