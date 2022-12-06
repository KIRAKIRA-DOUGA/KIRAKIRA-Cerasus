<template>
	<div class="desktopWeb">
		<SideBar />
		<div class="kirakiraRouterBox">
			<slot name="desktop-web-slot"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
	.desktopWeb {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.kirakiraRouterBox {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
