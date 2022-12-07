<template>
	<div class="desktop-web">
		<SideBar />
		<div class="main-page-box">
			<Banner />
			<div class="kirakira-router-box">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
	.desktop-web {
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

	.kirakira-router-box {
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
</style>
