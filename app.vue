<template>
	<div>
		<NuxtWelcome />
		<p>{{ a }}</p>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from "vue";
	import type { Ref } from "vue";

	const a: Ref<string> = ref("aaaaa");
	onMounted(() => {
		setInterval(() => {
			a.value += "a";
		}, 1000);
	});
</script>

<style lang="scss" scoped>
	p {
		background-color: #66ccff;
	}
</style>
