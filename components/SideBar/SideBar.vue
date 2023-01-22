<template>
	<div class="sidebar">
		<div class="sidebar-top sidebar-icons">
			<SideBarButton v-ripple icon="home" to="/" />
			<SideBarButton v-ripple icon="search" to="/search" />
			<SideBarButton v-ripple icon="history" />
			<SideBarButton v-ripple icon="star" />
			<SideBarButton v-ripple icon="feed" />
		</div>

		<div class="sidebar-center">
			<div class="sidebar-logo">
				<p>KIRAKIRA</p>
			</div>
			<div class="sidebar-stripes">
				<div class="sidebar-stripe" />
				<div class="sidebar-stripe" />
			</div>
		</div>

		<div class="sidebar-bottom sidebar-icons">
			<SideBarButton v-ripple icon="person" />
			<SideBarButton v-ripple icon="email" />
			<SideBarButton v-ripple icon="settings" to="/my/settings" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	.sidebar {
		@include sidebar-shadow;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 48px;
		background-color: c(main-bg);

		> div {
			width: 48px;
		}

		.sidebar-icons {
			display: flex;
			flex-direction: column;
			align-content: center;
			align-items: center;
			justify-content: center;
		}

		.sidebar-top {
			flex: 1;
			margin-top: 8px;

			.sidebar-button-wrapper {
				margin-bottom: 8px;
			}
		}

		.sidebar-center {
			display: flex;
			flex: 2;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			overflow: hidden;

			.sidebar-logo {
				color: c(accent);
				font-size: 24px;
				transform: rotate(-90deg);
			}

			.sidebar-stripes {
				margin-top: 48px;
				margin-left: -7px;
				transform: rotate(-33deg);

				.sidebar-stripe {
					width: 76px;
					height: 8px;
					margin-top: 12px;
					background-color: c(accent);
				}
			}
		}

		.sidebar-bottom {
			flex: 3;
			justify-content: flex-end;
			height: 150px;
			max-height: 150px;
			margin-bottom: 8px;

			.sidebar-button-wrapper {
				margin-top: 8px;
			}
		}
	}
</style>
