<script setup lang="ts">
	const props = defineProps<{
		collapsed?: boolean;
	}>();

	watchRoute((nowRoute, oldRoute) => console.log("route watch: ", nowRoute, oldRoute));

	function getRoute() {
		console.log("getRouter: ", getRoutePath());
	}
</script>

<template>
	<Transition name="banner">
		<div v-if="!collapsed" class="banner opened" @click="getRoute">
			hello, banner
			<div class="shadow"></div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
	.banner {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		overflow: hidden;

		// please romove when deploy 下方CSS请在部署前移除
		background-color: #0080001a; // TODO: 魔色待修改。

		&.opened {
			$banner-height: 140px;
			height: $banner-height;

			> .shadow {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(transparent 0%, transparent 95%, c(black, 33%) 100%);
				opacity: 0.1;
			}

			&.banner-enter-from,
			&.banner-leave-to {
				height: 0;

				> .shadow {
					background: linear-gradient(c(black, 33%) 80%, c(black, 80%));
					opacity: 1;
				}
			}
		}

		&,
		& * {
			transition: all $ease-out-expo 600ms;
		}
	}
</style>
