<script setup lang="ts">
	import { ComponentInternalInstance } from "vue";
	import TabBar, { typeError } from "./Bar.vue";

	const item = getCurrentInstance() as ComponentInternalInstance;
	const tabBar = item?.parent as ComponentInternalInstance;
	if (tabBar?.type !== TabBar)
		throw typeError;

	function onClick() {
		console.log(item);
		console.log(tabBar?.slots?.default?.());
	}
</script>

<template>
	<div @click="onClick">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">

</style>
