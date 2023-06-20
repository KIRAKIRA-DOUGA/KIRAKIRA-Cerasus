<script setup lang="ts">
	const props = defineProps<{
		collapsed?: boolean;
	}>();
</script>

<template>
	<Transition>
		<Comp v-if="!collapsed" class="opened" role="banner">
			<LogoCover noAnimation />
			<div class="shadow"></div>
		</Comp>
	</Transition>
</template>

<style scoped lang="scss">
	:comp {
		@include flex-center;
		position: relative;
		width: 100%;
		overflow: hidden;

		> .logo-cover {
			--width: 100dvw;
			--height: 280px;
			--full-logo: true;

			@media (width < 625px) {
				--full-logo: false;
			}
		}

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

			&.v-enter-from,
			&.v-leave-to {
				height: 0;

				> .shadow {
					background: linear-gradient(c(black, 33%) 80%, c(black, 80%));
					opacity: 1;
				}
			}
		}

		&,
		* {
			transition: all $ease-out-expo 600ms;
		}
	}
</style>
