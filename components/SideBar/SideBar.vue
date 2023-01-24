<script setup lang="ts">
	import { LogoTextFormType } from "components/Logo/Text.vue";

	const logoTextForm = ref<LogoTextFormType>("hidden");
	const showStripes = ref(false);

	onMounted(() => {
		function onResize() {
			const height = window.innerHeight;
			logoTextForm.value = height < 678 ? "hidden" : height < 765 ? "half" : "full";
			showStripes.value = height >= 540;
		}
		window.addEventListener("resize", onResize);
		onResize();
	});
</script>

<template>
	<div class="sidebar">
		<div class="top icons">
			<SideBarButton icon="home" to="/" />
			<SideBarButton icon="search" to="/search" />
			<SideBarButton icon="history" />
			<SideBarButton icon="star" />
			<SideBarButton icon="feed" />
			<SideBarButton icon="upload" />
		</div>

		<Transition name="stripes">
			<div v-if="showStripes" class="center">
				<div class="stripes">
					<div v-for="i in 2" :key="`stripe-${i}`" class="stripe"></div>
				</div>
				<LogoText :form="logoTextForm" class="logo-text" />
			</div>
		</Transition>

		<div class="bottom icons">
			<SideBarButton icon="person" />
			<SideBarButton icon="email" />
			<SideBarButton icon="settings" to="/settings" />
		</div>
	</div>
</template>

<style scoped lang="scss">
	$bar-size: 48px;
	$icons-gap: 8px;

	.sidebar {
		@include sidebar-shadow;
		@include flex-center;
		flex-direction: column;
		justify-content: space-between;
		width: $bar-size;
		padding: $icons-gap 0;
		overflow: hidden;
		background-color: c(main-bg);

		> div {
			flex-grow: 0;
			width: $bar-size;
		}

		.icons {
			@include flex-center;
			flex-direction: column;
			gap: $icons-gap;

			@media (max-height: 432px) {
				gap: 0;
			}
		}

		.top {
			max-height: 280px;
		}

		.center {
			@include flex-center;
			width: max-content;
			rotate: -90deg;

			.stripes {
				margin-right: 24px;
				rotate: -33deg;

				.stripe {
					display: inline-block;
					width: 8px;
					height: 76px;
					margin-right: 12px;
					background-color: c(accent);
				}
			}

			&.stripes-enter-from,
			&.stripes-leave-to {
				.stripes {
					opacity: 0;
					rotate: 0deg;
				}
			}

			.logo-text {
				pointer-events: none;
			}
		}

		.bottom {
			justify-content: flex-end;
			height: 136px;
		}
	}
</style>
