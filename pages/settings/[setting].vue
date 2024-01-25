<docs>
	# 缺省未设计的设置子页面
</docs>

<template>
	<div class="no-settings">
		<LogoSettings />

		<p>{{ t.settings }}</p>
		<span>{{ t.unselected.settings }}</span>
	</div>
</template>

<style scoped lang="scss">
	.no-settings {
		@include flex-center;
		flex-direction: column;
		gap: 1rem;
		height: 70dvh;
		color: c(icon-color);
		transition: none;
	}
</style>
