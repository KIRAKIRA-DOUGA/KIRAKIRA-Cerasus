<script setup lang="ts">

</script>

<template>
	<Comp role="textbox" />
</template>

<style scoped lang="scss">
	:comp {
		@include control-inner-shadow;
		display: flex;
		flex-shrink: 0;
		height: 36px;
		background-color: c(inset-bg);
	}
</style>
