<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: string;
		/** 图标是否放在文本后面。 */
		iconBehind?: boolean;
		/** 是否为次要/无背景按钮。 */
		secondary?: boolean;
		/**
		 * 点击按钮是否切换导航？
		 * #### 注意
		 * 点击按钮将会立刻切换导航，使单击事件失去作用，不推荐使用该功能。
		 */
		href?: string;
	}>();

	const emits = defineEmits<{
		(event: "click", arg: MouseEvent): void;
	}>();

	/**
	 * 单击鼠标事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		emits("click", e);
		if (props.href) navigate("/");
	}
</script>

<template>
	<button v-ripple type="button" :class="{ secondary }" @click="onClick">
		<NuxtIcon v-if="icon && !iconBehind" :name="icon" class="icon front" />
		<slot></slot>
		<NuxtIcon v-if="icon && iconBehind" :name="icon" class="icon behind" />
	</button>
</template>

<style scoped lang="scss">
	button {
		@include flex-center;
		@include button-shadow;
		@include radius-small;
		display: inline-flex;
		gap: 8px;
		min-height: 36px;
		padding: 8px 16px;
		color: white;
		font-size: inherit;
		letter-spacing: 0.05em;
		vertical-align: middle;
		background: c(accent);
		border: none;
		cursor: pointer;
		transition: $fallback-transitions, all $ease-out-back 250ms !important;
		appearance: none;

		&:hover {
			@include button-shadow-hover;
			background: c(accent-hover);
		}

		&:active {
			@include button-scale-active;
			background: c(accent);
		}

		&[disabled] {
			background: c(accent-disabled);
			box-shadow: none !important;
			pointer-events: none;
		}

		&:focus {
			@include button-shadow-focus;
		}

		&:hover:focus {
			@include button-shadow-hover-focus;
		}

		&.secondary {
			color: c(accent);
			background: transparent;
			box-shadow: none;

			&:hover {
				background: c(accent-hover, 8%);
			}

			&:active {
				background: c(accent-pressed, 8%);
			}

			&:focus {
				box-shadow: none;
			}

			&:focus-visible {
				@include button-shadow-focus-only;
			}

			&[disabled] {
				color: c(accent-disabled);
			}
		}
	}

	.icon {
		$padding-inset: 2px;
		color: white;
		font-size: 18px;

		&.front {
			margin-left: -$padding-inset;
		}

		&.behind {
			margin-right: -$padding-inset;
		}
	}
</style>
