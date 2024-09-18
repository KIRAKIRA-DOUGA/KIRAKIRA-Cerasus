<script setup lang="ts">
	const props = defineProps<{
		/** 图标，可选。 */
		icon?: DeclaredIcons;
		/**
		 * 点击按钮是否切换导航？
		 * #### NOTE
		 * 点击按钮将会立刻切换导航，使单击事件失去作用。
		 *
		 * **不推荐使用该功能**，比如鼠标中键新窗口打开，触屏长按链接操作都将不再起作用。应该使用链接组件。
		 */
		href?: string;
		/** 按钮是否在加载中？ */
		loading?: boolean;
		/** 按钮事件级别。 */
		severity?: "warning" | "error";
	}>();

	const emits = defineEmits<{
		click: [e: MouseEvent];
	}>();

	/**
	 * 单击鼠标事件。
	 * @param e - 鼠标事件。
	 */
	function onClick(e: MouseEvent) {
		props.href && navigate(props.href);
		emits("click", e);
	}
</script>

<template>
	<button
		type="button"
		@click="onClick"
		:class="severity && ['force-color', { warning: 'yellow', error: 'red' }[severity]]"
	>
		<div v-ripple class="button-content">
			<Icon v-if="icon" :name="icon" />
			<span class="caption"><span><slot></slot></span></span>
			<Transition>
				<ProgressBar v-if="loading" />
			</Transition>
			<LocaleLink v-if="href" :draggable="false" :to="href" class="link lite" :tabindex="-1" />
		</div>
	</button>
</template>

<style scoped lang="scss">
	@layer props {
		button {
			/// 外观偏好，可选的值为：primary | secondary | tertiary。
			/// primary: 强调色按钮。
			/// secondary: 次要/无背景按钮。
			/// tertiary: 非强调色状态按钮。
			--appearance: primary;
			/// 是否隐藏标签文本？
			--hide-caption: false;
			/// 图标是否放在文本后面。
			--icon-behind: false;
		}
	}

	button {
		display: inline-grid;
		color: white;

		&[disabled] {
			pointer-events: none;
		}

		* {
			font-family: inherit;
			font-feature-settings: inherit;
		}

		&.secondary {
			--appearance: secondary;
		}

		&.tertiary {
			--appearance: tertiary;
		}

		&.icon-behind {
			--icon-behind: true;
		}

		&:deep(*) {
			font-variant-numeric: inherit;
		}
	}

	.button-content {
		@include flex-center;
		@include button-shadow;
		@include round-small;
		@include square(inherit);
		position: relative;
		display: inline-flex;
		flex-shrink: 0;
		min-height: 36px;
		padding: 8px 16px;
		letter-spacing: 0.05em;
		white-space: nowrap;
		vertical-align: middle;
		background-color: c(accent);
		touch-action: manipulation;
		transition: $fallback-transitions, all $ease-out-back 500ms !important;

		> span {
			font-family: inherit;
		}

		@container style(--icon-behind: true) {
			flex-direction: row-reverse;
		}

		button:active > & {
			@include button-scale-pressed;
			background-color: c(accent);
		}

		button[disabled] > & {
			background-color: c(accent-disabled) !important;
			box-shadow: none !important;

			html.dark & :is(.caption, .icon) {
				opacity: 0.4;
			}
		}

		button:focus > & {
			@include button-shadow-focus;
		}

		button:any-hover > & {
			// 在触摸屏上不要支持 hover 样式。
			@include button-shadow-hover;
			background-color: c(accent-hover);
		}

		button:any-hover:focus > & {
			@include button-shadow-hover-focus;
		}

		@container style(--appearance: secondary) or style(--appearance: tertiary) {
			background-color: transparent;

			button:not(:focus-visible) > & {
				box-shadow: none !important;
			}

			.icon {
				color: inherit;
			}
		}

		@container style(--appearance: secondary) {
			@include accent-ripple;
			color: c(accent);

			button:any-hover > &,
			button:active > & {
				background-color: c(accent-hover-overlay);
			}

			button:focus-visible > &,
			button:focus-visible:hover > & {
				@include button-shadow-focus-only;
			}

			button[disabled] > & {
				color: c(accent-disabled);
				background-color: transparent !important;
			}
		}

		@container style(--appearance: tertiary) {
			color: c(icon-color);

			button:any-hover > &,
			button:active > & {
				background-color: c(hover-overlay);
			}

			button:focus-visible > &,
			button:focus-visible:hover > & {
				@include button-shadow-unchecked-focus-only;
			}

			button[disabled] > & {
				color: c(gray-40);
				background-color: transparent !important;
			}
		}
	}

	@mixin icon-only {
		margin-right: 0 !important;
		font-size: 24px;
	}

	.icon {
		$padding-inset: 2px;
		$padding-outset: 8px;
		$size: 18px;
		min-width: $size;
		min-height: $size;
		margin-right: $padding-outset;
		color: inherit;
		font-size: $size;

		@container style(--icon-behind: false) {
			margin-left: -$padding-inset;
		}

		@container style(--icon-behind: true) {
			margin-right: -$padding-inset;
			margin-left: $padding-outset;
		}

		&:has(+ .caption > :empty) {
			@include icon-only;
		}

		@container style(--hide-caption: true) {
			@include icon-only;
		}
	}

	.caption {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;

		> * {
			overflow: hidden;
		}

		@container style(--hide-caption: true) {
			grid-template-columns: 0fr;
		}
	}

	.link {
		@include square(100%);
		position: absolute !important;
	}

	.progress-bar:deep() {
		position: absolute !important;
		bottom: 0;
		width: 100%;
		border-radius: 0 !important;

		.wrapper {
			background-color: transparent;
			translate: -50%;
		}

		button:not([disabled]) & .line {
			background-color: white;
		}

		&.v-enter-from,
		&.v-leave-to {
			height: 0;
		}
	}
</style>
