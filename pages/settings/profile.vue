<script setup lang="ts">
	const nickname = ref("");
</script>

<template>
	<div class="nickname">
		<TextBox v-model="nickname" placeholder="昵称" size="large" icon="person" />
		<span>1~20个字符，仅可包含大小写拉丁字母、数字、常用平/片假名、汉字、特殊符号 ｢-｣ ｢_｣</span>
	</div>
</template>

<style scoped lang="scss">
	.nickname {
		@include flex-block;
		gap: 8px;

		span {
			color: c(icon-color);
			font-size: 12px;
			text-align: right;
		}
	}
</style>
