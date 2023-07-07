<docs>
	# 用户头像
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 头像网址。 */
		avatar?: string;
	}>();
</script>

<template>
	<Comp v-ripple>
		<img v-if="avatar" :src="avatar" alt="avatar" draggable="false" />
		<Icon v-else name="person" />
	</Comp>
</template>

<style scoped lang="scss">
	@layer utilities {
		:comp {
			@include square(58px, true);
			font-size: 24px;
		}
	}

	:comp {
		@include circle;
		@include flex-center;
		overflow: hidden;
		color: c(icon-color);
		background-color: c(gray-20);

		> img {
			z-index: 1;
			width: 100%;
			object-fit: cover;
			aspect-ratio: 1 / 1;

			&:any-hover {
				scale: 125%;
				filter: brightness(0.85);
			}

			&:not(:any-hover) {
				transition-duration: 1s;
			}
		}
		
		&:any-hover {
			background-color: c(gray-30);
		}
	}
</style>
