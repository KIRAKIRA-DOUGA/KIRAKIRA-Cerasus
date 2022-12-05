<template>
	<div>
		<SideBar />
		<div class="kirakiraRouterBox">
			<slot name="desktop-web-slot"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
	.kirakiraRouterBox {
		position: absolute;
		left: var(--kirakira-main-side-bar-width);
		top: var(--zero);

		width: calc(var(--full-screen-width) - var(--kirakira-main-side-bar-width));
		height: var(--full-screen-height);

		/* background-color: yellow; */
	}
</style>
