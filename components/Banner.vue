<script setup lang="ts">
	const props = defineProps<{
		collapsed?: boolean;
	}>();
</script>

<template>
	<Transition name="banner">
		<div v-if="!collapsed" class="banner opened">
			<LogoCover width="100vw" :height="280" fullLogo />
			<div class="shadow"></div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
	.banner {
		@include flex-center;
		position: relative;
		width: 100%;
		overflow: hidden;

		&.opened {
			$banner-height: 10rem;
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
