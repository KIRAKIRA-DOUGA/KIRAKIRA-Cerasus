<template>
	<NuxtLayout :name="layout">
		<template #[slotName]>
			<router-view />
		</template>
	</NuxtLayout>
</template>

<script setup lang="ts">
	import "assets/scss/global.scss";
	import { ref } from "vue";

	const layout = ref("desktop-web");
	const slotName = ref("desktop-web-slot");

	// 下方为测试用，5秒延时后将具名layout和具名插槽的名字赋值为 PE 端

	// setTimeout(() => {
	// 	layout.value = "pocket-edition-web";
	// 	slotName.value = "pocket-edition-web-slot";
	// }, 5000);
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
