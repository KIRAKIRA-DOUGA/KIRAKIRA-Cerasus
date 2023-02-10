<script setup lang="ts">

</script>

<template>
	<div class="login-window">
		<div class="main">
		</div>
		<div class="cover-wrapper">
			<LogoCover />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.login-window {
		@include dropdown-flyouts;
		display: flex;
		width: 800px;
		height: 400px;
		background-color: c(inner-color-85, 50%);

		.main {
			@include flex-block;
			width: 400px;
			height: 100%;
		}
	}
</style>
