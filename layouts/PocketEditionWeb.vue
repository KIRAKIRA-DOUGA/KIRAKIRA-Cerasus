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

<script setup lang="ts">

</script>

<style lang="scss">
	.kirakira-router-box {
		position: absolute;
		left: var(--kirakira-main-side-bar-width);
		top: var(--zero);

		width: calc(var(--full-screen-width) - var(--kirakira-main-side-bar-width));
		height: var(--full-screen-height);

		// background-color: var(--main-bg);
	}
</style>
