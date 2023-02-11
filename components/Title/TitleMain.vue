<script setup lang="ts">

</script>

<template>
	<div class="big">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
	.big {
		color: c(accent);
		font-weight: 900;
		font-size: 40px;
		font-style: italic;
	}
</style>
