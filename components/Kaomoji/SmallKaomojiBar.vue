<script setup lang="ts">

</script>

<template>
	<div class="small-kaomoji-bar">
	</div>
</template>

<style scoped lang="scss">
	.small-kaomoji-bar {
		@include dropdown-flyouts;
		@include radius-large;
		display: flex;
		flex-flow: column;
		width: 150px;
		height: 100px;
		background-color: c(acrylic-bg);
	}
</style>
