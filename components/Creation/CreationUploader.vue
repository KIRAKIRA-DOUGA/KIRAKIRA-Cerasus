<script setup lang="ts">
</script>

<template>
	<Comp>
		<div class="avatar"></div>
	</Comp>
</template>

<style scoped lang="scss">
	.avatar {
		@include square(58px);
		@include circle;
		background-color: c(gray-30);
	}
</style>
