<docs>
	角落里的图标
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 图标。 */
		icon: string;
		/** 是否使用大图标。 */
		big?: boolean;
		/** 是否放置在底部。 */
		bottom?: boolean;
		/** 是否让图标保持旋转。 */
		rotating?: boolean;
	}>();
</script>

<template>
	<Comp :class="{ big, bottom }">
		<NuxtIcon :name="icon" :class="{ rotating }" />
	</Comp>
</template>

<style scoped lang="scss">
	$size: 128px;
	$big-size: 256px;

	:comp {
		@include square($size);
		position: absolute;
		top: 0;
		right: 0;
		overflow: hidden;
		color: c(accent, 15%);
		font-size: $size;
		pointer-events: none;

		&.big {
			@include square($big-size);
			font-size: $big-size;
		}

		&.bottom {
			top: unset;
			bottom: 0;
		}
	}

	.nuxt-icon {
		position: absolute;
		top: -50px;
		right: -50px;

		.bottom & {
			top: unset;
			bottom: -50px;
		}

		.big & {
			top: -64px;
			right: -64px;
		}

		.big.bottom & {
			top: unset;
			bottom: -64px;
		}

		&.rotating {
			animation: rotating linear 30s infinite;
		}
	}

	@keyframes rotating {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>
