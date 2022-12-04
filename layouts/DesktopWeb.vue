<template>
	<div>
		<SideBar />
		<div class="kirakira-router-box">
			<slot name="desktop-web-slot" />
		</div>
	</div>
</template>

<script setup lang="ts">
	import "assets/scss/global.scss";
</script>

<style lang="scss">
	.kirakira-router-box {
		position: absolute;
		left: var(--kirakira-main-side-bar-width);
		top: var(--ZERO);

		width: calc(var(--full-screen-width) - var(--kirakira-main-side-bar-width));
		height: var(--full-screen-height);

		/* background-color: yellow; */
	}
</style>
