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
	:root {
		/* colors */
		--kirakira-side-bar-background-color: #6cf;

		/* css size */
		--full-screen-height: 100vh;
		--full-screen-width: 100vw;

		--zero: 0;
		--zero-pixel: 0;

		/* side bar size */
		--kirakira-main-side-bar-width: 60px;
	}

	body {
		padding: 0;
		margin: 0;
	}

	.kirakiraRouterBox {
		position: absolute;
		left: var(--kirakira-main-side-bar-width);
		top: var(--zero);

		width: calc(var(--full-screen-width) - var(--kirakira-main-side-bar-width));
		height: var(--full-screen-height);

		/* background-color: yellow; */
	}

</style>
