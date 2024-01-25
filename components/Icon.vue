<docs>
	# 图标组件
	封装的总图标组件。如果下次想更换图标模块可直接在此处统一更换。
	目前的图标模块：
	在开发环境下是 `@nuxtjs/svg-sprite`；
	在生产环境下是 `nuxt-icons`。
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图标文件名称。 */
		name: DeclaredIcons;
		/** 是否保持图标本身的颜色。 */
		filled?: boolean;
	}>(), {
		filled: false,
	});
</script>

<template>
	<i class="icon" :class="{ filled }" role="img" :aria-label="new VariableName(name).words">
		<SvgIcon v-if="environment.production" :name="name" />
		<NuxtIcon v-else :name="name" :filled="filled" />
	</i>
</template>

<style scoped lang="scss">
	.icon {
		@include square(1em);
		display: inline-flex;

		&:not(.filled) :deep(svg) {
			fill: currentColor;
		}
		
		:deep(svg) {
			@include square(1em);
		}
		
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
