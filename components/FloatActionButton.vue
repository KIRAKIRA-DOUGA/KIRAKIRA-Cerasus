<docs>
	# 浮动操作按钮
</docs>

<script setup lang="ts">
	const props = defineProps<{
		/** 图标。 */
		icon: string;
	}>();
</script>

<template>
	<Comp v-ripple role="button" :aria-label="icon">
		<Icon v-if="icon" :name="icon" />
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 容器大小。
			--wrapper-size: 56px;
			/// 图标大小。
			--icon-size: 24px;
		}
	}

	:comp {
		@include square(var(--wrapper-size));
		@include circle;
		@include button-shadow;
		@include flex-center;
		color: white;
		font-size: 24px;
		background-color: c(accent);
		cursor: pointer;

		&:any-hover {
			@include button-shadow-hover;
			background-color: c(accent-hover);
		}

		&:any-hover:focus-visible {
			@include button-shadow-hover-focus;
		}

		&:active {
			@include button-scale-pressed;
			background-color: c(accent-pressed);
		}

		&:focus-visible {
			@include button-shadow-focus;
		}
	}

	.icon {
		font-size: var(--icon-size);
	}
</style>
