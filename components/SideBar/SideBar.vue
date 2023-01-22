<template>
	<div class="sidebar">
		<div class="sidebar-top">
			<LocaleLink to="/">
				<SideBarButton v-ripple icon="home" />
			</LocaleLink>
			<LocaleLink to="/search">
				<SideBarButton v-ripple icon="search" />
			</LocaleLink>
			<LocaleLink to="/my/history">
				<SideBarButton v-ripple icon="history" />
			</LocaleLink>
			<LocaleLink to="/my/favorite">
				<SideBarButton v-ripple icon="star" />
			</LocaleLink>
			<LocaleLink to="/my/feed">
				<SideBarButton v-ripple icon="feed" />
			</LocaleLink>
		</div>
		<div class="sidebar-center"></div>
		<div class="sidebar-bottom"></div>
	</div>
</template>

<style scoped lang="scss">
	.sidebar {
		@include sidebar-shadow;
		display: block;
		width: 48px;
		background-color: c(main-bg);

		a {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 40px;
			margin-bottom: 8px;
			background: none;
		}

		.sidebar-top {
			display: flex;
			flex-direction: column;
			align-content: center;
			align-items: center;
			justify-content: center;
			width: 48px;
			margin-top: 8px;
		}
	}
</style>
