<docs>
	# 缺省未设计的设置子页面
</docs>

<script setup lang="ts">

</script>

<template>
	<div class="no-settings">
		<Icon name="settings" />
		<p>{{ t.settings_unselected }}</p>
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
		transition: none;

		.icon {
			font-size: 128px;
		}
	}
</style>
