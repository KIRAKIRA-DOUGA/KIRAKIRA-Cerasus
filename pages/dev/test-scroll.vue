<script setup lang="ts">

</script>

<template>
	<div class="content">
		<NuxtImg src="/static/images/palettes/blue.png" />
		<div v-for="i in 100" :key="i" class="item">Item {{ i }}</div>
		<NuxtImg src="/static/images/palettes/pink.png" />
	</div>
</template>

<style scoped lang="scss">
	img {
		width: 120%;
	}
</style>
