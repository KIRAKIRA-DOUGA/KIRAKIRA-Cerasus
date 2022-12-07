<template>
	<div class="desktopWeb">
		<SideBar />
		<div class="main-page-box">
			<Banner />
			<div class="kirakiraRouterBox">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
	.desktopWeb {
		display: flex;
		width: var(--full-screen-width);
		height: var(--full-screen-height);
	}

	.main-page-box {
		width: 100%;
		height: 100%;

		display: flex;
		flex-direction: column;
	}

	.kirakiraRouterBox {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
