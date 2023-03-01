<script setup lang="ts">

</script>

<template>
	<div class="container">
		<SideBar />
		<main>
			<slot></slot>
			这里是 PE 版的 KIRAKIRA, 正在施工中
			<!-- TODO: [02] 这里是 PE 版的 KIRAKIRA, 正在施工中…… -->
		</main>
	</div>
</template>

<style scoped lang="scss">
	main {
		display: flex;
	}
</style>
