<script setup lang="ts">

</script>

<template>
	<Comp role="contentinfo">
		<slot></slot>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-small;
		padding: 0 8px;
		color: white;
		text-align: center;
		background-color: c(accent);
	}
</style>
