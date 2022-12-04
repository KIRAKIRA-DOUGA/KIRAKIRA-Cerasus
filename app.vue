<template>
	<!-- <NuxtWelcome /> -->
	<!-- <HelloWorld /> -->
	<div>
		<SideBar />
		<div class="kirakira-router-box">
			<router-view />
		</div>
	</div>
</template>

<script setup lang="ts">
	import "assets/scss/global.scss";
</script>

<style lang="scss">
	/* colors */
	body {
		--kirakira-side-bar-background-color: #66ccff;
	}

	/* css size */
	body {
		--full-screen-height: 100vh;
		--full-screen-width: 100vw;

		--ZERO: 0;
		--ZERO-PIXEL: 0px;
	}

	/* side bar size */
	body {
		--kirakira-main-side-bar-width: 60px;
	}

	body {
		padding: 0;
		margin: 0;
	}

	.kirakira-router-box {
		position: absolute;
		left: var(--kirakira-main-side-bar-width);
		top: var(--ZERO);

		width: calc(var(--full-screen-width) - var(--kirakira-main-side-bar-width));
		height: var(--full-screen-height);

		/* background-color: yellow; */
	}

</style>
