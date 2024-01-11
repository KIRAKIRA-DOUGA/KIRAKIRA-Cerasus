<docs>
	# 卡片内复选框
</docs>

<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 图片。 */
		image?: string;
	}>(), {
		image: undefined,
	});

	const checked = defineModel<boolean>({ default: false });
</script>

<template>
	<Comp role="checkbox" :aria-checked="checked" :class="{ checked }" :tabindex="0" @click="checked = !checked">
		<div class="card">
			<img :src="image" />
			<div class="float">
				<Checkbox v-model:single="checked" readonly />
			</div>
		</div>
		<p class="text"><slot></slot></p>
	</Comp>
</template>

<style scoped lang="scss">
	@layer props {
		:comp {
			/// 卡片宽度。
			--width: 208px;
			/// 卡片高度。
			--height: 117px;
		}
	}
	
	:comp {
		display: inline-block;
	}

	.card {
		@include round-large;
		position: relative;
		width: var(--width);
		height: var(--height);
		background-color: c(gray-20);
		outline: 1px solid transparent;
		cursor: pointer;

		:comp:is(:any-hover, :focus-visible) & {
			outline-color: c(gray-40);
		}

		:comp:active & {
			@include button-scale-pressed;
		}
		
		.float {
			@include round-small;
			@include card-shadow-with-blur;
			position: absolute;
			top: 12px;
			left: 12px;
			padding: 11px;
			background-color: c(main-bg, 50%);
			pointer-events: none;
			
			:comp:not(.checked, :any-hover, :focus-visible) & {
				opacity: 0;
			}
		}
	}

	.text {
		margin-top: 8px;

		&:empty {
			display: none;
		}
	}
</style>
