<template>
	<div class="kirakira-main-side-bar-box">
		<SideBarHomeButton />
	</div>
</template>

<style scoped>
	.kirakira-main-side-bar-box{

		position: absolute;
		top: var(--ZERO);
		left: var(--ZERO);

		width: 60px;
		height: var(--full-screen-height);

		background-color: var(--kirakira-side-bar-background-color);
	}
</style>
