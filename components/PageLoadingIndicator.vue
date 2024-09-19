<docs>
	# 全局加载指示器
	用于替代 NuxtLoadingIndicator。

	根据 Nuxt 文档编写：https://nuxt.com/docs/api/components/nuxt-loading-indicator
</docs>

<script setup lang="ts">
	const { progress, isLoading, error, start, finish, clear } = useLoadingIndicator();
</script>

<template>
	<Comp>
		<ProgressBar :hidden="!isLoading" :value="progress" />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		position: fixed;
		top: 0;
		right: -4px;
		left: 0;
		z-index: calc(infinity);
		pointer-events: none;

		.progress-bar {
			border-radius: 0;
			transform-origin: top;

			&:deep(.determinate) {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}
	}
</style>
