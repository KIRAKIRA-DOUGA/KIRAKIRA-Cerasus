<script setup lang="ts">
	const showBanner = ref(false);
	watchRoute(() => (showBanner.value = getRoutePath() === ""), true);
</script>

<template>
	<div class="desktop">
		<SideBar />
		<div class="container">
			<Banner :collapsed="!showBanner" />
			<!--
				TODO: 我真的觉得将 banner 始终固定在 layout 中是一大浪费。它只在主页中显示，应该放在主页中。
				另外，稍后将这个 flex 横向布局拆了，内容放在根元素下正常布局，侧边栏悬挂在左边。
			-->
			<div class="page">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.desktop {
		display: flex;
		width: 100vw;
		height: 100vh;
		transition: none;
	}

	.container {
		@include square(100%);
		overflow: hidden auto;
	}

	.page {
		@include square(100%);
	}
</style>
