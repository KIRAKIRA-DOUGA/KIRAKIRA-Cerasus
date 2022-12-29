<script setup lang="ts">

</script>

<template>
	<div>
		<SideBar />
		<div class="kirakira-router-box">
			<slot name="pocket-edition-web-slot"></slot>
			这里是 PE 版的 KIRAKIRA, 正在施工中
			<!-- TODO: 这里是 PE 版的 KIRAKIRA, 正在施工中…… -->
		</div>
	</div>
</template>

<style scoped lang="scss">
	.kirakira-router-box {
		position: absolute;
		top: var(--zero);
		left: var(--kirakira-main-side-bar-width);
		width: calc(var(--full-screen-width) - var(--kirakira-main-sidebar-width));
		height: var(--full-screen-height);
	}
</style>
