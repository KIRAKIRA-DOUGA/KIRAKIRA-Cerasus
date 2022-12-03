<script setup lang="ts">
	const page = ref(1);
</script>

<template>
	<div class="kirakira-home-page-box">
		<div>
			kirakira home
		</div>
		<NuxtLink to="/VideoPlay">
			video
		</NuxtLink>
		<PageController :pages="7" :displayPageCount="7" :current="page" @onChangePage="e => page = e.page" />
	</div>
</template>

<style scoped lang="scss">
	.kirakira-home-page-box {
		background-color: yellow;
	}
</style>
