<template>
	<div class="sidebar">
		<SideBarHomeButton />
	</div>
</template>

<style scoped lang="scss">
	.sidebar {
		@include sidebar-shadow;
		width: 48px;
		background-color: c(main-bg);
	}
</style>
