<script setup lang="ts">

</script>

<template>
	<kira-component class="accordion">
		<slot></slot>
	</kira-component>
</template>

<style scoped lang="scss">
	.accordion {
		@include radius-large;
		@include chip-shadow;
		background-color: c(main-bg, 50%);
	}
</style>
