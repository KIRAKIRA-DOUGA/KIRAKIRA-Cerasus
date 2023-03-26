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
		 * #### NOTE
		 * 点击按钮将会立刻切换导航，使单击事件失去作用。
		 *
		 * **不推荐使用该功能**，比如鼠标中键新窗口打开，触屏长按链接操作都将不再起作用。应该使用链接组件。
		 */
		href?: string;
	}>();

	const emits = defineEmits<{
		(event: "click", payload: MouseEvent): void;
	}>();

	/**
	 * 单击鼠标事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		emits("click", e);
	}
</script>

<template>
	<button
		v-ripple
		type="button"
		:class="{ secondary, 'icon-behind': iconBehind }"
		@click="onClick"
	>
		<LocaleLink v-if="href" draggable="false" :to="href" class="link lite" />
		<NuxtIcon v-if="icon" :name="icon" />
		<span><slot></slot></span>
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
		white-space: nowrap;
		vertical-align: middle;
		background: c(accent);
		border: none;
		cursor: pointer;
		transition: $fallback-transitions, all $ease-out-back 500ms !important;
		appearance: none;

		> span {
			font-family: inherit;
		}

		&.icon-behind {
			flex-direction: row-reverse;
		}

		&:hover {
			@include button-shadow-hover;
			background: c(accent-hover);
		}

		&:active {
			@include button-scale-pressed;
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

	.nuxt-icon {
		$padding-inset: 2px;
		$size: 18px;
		min-width: $size;
		min-height: $size;
		color: white;
		font-size: $size;

		button:not(.icon-behind) > & {
			margin-left: -$padding-inset;
		}

		button.icon-behind > & {
			margin-right: -$padding-inset;
		}
	}

	.link {
		@include square(100%);
		position: absolute;
	}
</style>
