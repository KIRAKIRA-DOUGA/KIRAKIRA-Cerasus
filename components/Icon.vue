<docs>
	# 图标组件
	封装的总图标组件。如果下次想更换图标模块可直接在此处统一更换。
	目前的图标模块：@nuxt/icon
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

	const iconName = computed(() => {
		return props.name.replace(/^(.*)\/|^/, (_, prefix) => (prefix ?? "kirakira") + ":");
	});
</script>

<template>
	<i class="icon" :class="{ filled }" role="img" :aria-label="new VariableName(name).words">
		<NuxtIcon :name="iconName" />
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
	}
</style>
