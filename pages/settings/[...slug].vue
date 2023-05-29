<docs>
	# 缺省未设计的设置子页面
</docs>

<script setup lang="ts">
	// TODO: 该页面会和外面的 [...slug].vue 在 SSR 阶段冲突（完全加载后才会正常），需要一个更合理的方式解决。
</script>

<template>
	<div class="no-settings">
		<Icon name="settings" />
		<p>请选择一项设置</p>
	</div>
</template>

<style scoped lang="scss">
	.no-settings {
		@include flex-center;
		flex-direction: column;
		gap: 1rem;
		height: 70dvh;
		color: c(icon-color);
		font-size: 32px;

		.icon {
			font-size: 128px;
		}
	}
</style>
