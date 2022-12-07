<template>
	<div class="desktop-web">
		<SideBar />
		<div class="kirakira-router-box">
			<slot name="desktop-web-slot"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
	.desktop-web {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.kirakira-router-box {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
