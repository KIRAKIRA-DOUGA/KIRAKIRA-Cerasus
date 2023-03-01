<script setup lang="ts">

</script>

<template>
	<kira-component class="badge">
		<slot></slot>
	</kira-component>
</template>

<style scoped lang="scss">
	.badge {
		@include radius-small;
		padding: 0 8px;
		color: white;
		text-align: center;
		background-color: c(accent);
	}
</style>
