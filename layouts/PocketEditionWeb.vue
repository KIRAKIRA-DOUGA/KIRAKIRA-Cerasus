<script setup lang="ts">

</script>

<template>
	<div class="mobile">
		<SideBar />
		<div class="page">
			<slot></slot>
			这里是 PE 版的 KIRAKIRA, 正在施工中
			<!-- TODO: 这里是 PE 版的 KIRAKIRA, 正在施工中…… -->
		</div>
	</div>
</template>

<style scoped lang="scss">
	.page {
		display: flex;
	}
</style>
