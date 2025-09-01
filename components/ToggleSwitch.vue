<script setup lang="ts">
	const props = withDefaults(defineProps<{
		/** 打开，单向绑定使用。 */
		on?: boolean;
		/** 禁用？ */
		disabled?: boolean;
		/** 图标，可选。 */
		icon?: DeclaredIcons;
		/** 详细信息。 */
		details?: Readable;
		/** 只读？ */
		readonly?: boolean;
	}>(), {
		disabled: false,
		icon: undefined,
		details: undefined,
	});

	const model = defineModel<boolean>();
	const on = withOneWayProp(model, () => props.on);
	const isDraging = ref(false);
	const toggleSwitch = refComp();
	const hasLabel = hasContentInDefaultSlot() || !!props.details;

	/**
	 * 拖拽滑块逻辑处理。
	 * @param e - 指针事件（包括鼠标和触摸）。
	 */
	function onThumbDown(e: PointerEvent) {
		const thumb = e.target as HTMLDivElement;
		const control = thumb.parentElement!;
		const thumbWidth = thumb.getBoundingClientRect().width;
		const controlRect = control.getBoundingClientRect();
		const left = controlRect.left, max = controlRect.width - thumbWidth;
		const x = e.pageX - left - thumb.offsetLeft;
		const firstTime = new Date().getTime();
		const pointerMove = (e: PointerEvent) => {
			thumb.style.left = `${clamp(e.pageX - left - x, 0, max)}px`;
		};
		const pointerUp = (e: PointerEvent) => {
			document.removeEventListener("pointermove", pointerMove);
			document.removeEventListener("pointerup", pointerUp);
			const isOn = e.pageX - x > left + max / 2;
			model.value = isOn;
			thumb.style.removeProperty("left");
			const lastTime = new Date().getTime();
			isDraging.value = lastTime - firstTime > 200; // 定义识别为拖动而不是点击的时间差。
		};
		document.addEventListener("pointermove", pointerMove);
		document.addEventListener("pointerup", pointerUp);
	}

	/**
	 * 点击事件。为了和拖拽事件让位。
	 */
	function onClick() {
		if (!isDraging.value) model.value = !model.value;
		isDraging.value = false;
	}

	// 如果切换开关开启情况与 prop 不同，就强制使其相同。
	watch(() => toggleSwitch.value?.classList.contains("on"), () => {
		if (!toggleSwitch.value) return;
		if (on.value !== toggleSwitch.value.classList.contains("on"))
			setClassEnabled(toggleSwitch, "on", on.value);
	}, { immediate: true });

	// 当键盘松开空格键时相当于点击复选框。
	// 当键盘按下空格键时不要下滑页面。
</script>

<template>
	<Comp
		ref="toggleSwitch"
		:class="{ on, disabled }"
		:tabindex="!disabled && !props.readonly ? 0 : -1"
		role="switch"
		:aria-checked="on"
		@click="onClick"
		@keydown.space.prevent.stop
		@keyup.space.prevent="onClick"
		@keyup.enter.prevent="onClick"
	>
		<Icon v-if="icon" :name="icon" />
		<div v-if="hasLabel" class="content">
			<label class="title"><slot></slot></label>
			<label v-if="details || $slots.details" class="details"><slot name="details">{{ details }}</slot></label>
		</div>
		<div class="switch">
			<div class="base"></div>
			<div class="thumb" @pointerdown="onThumbDown"></div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	$width: 34px;
	$base-height: 14px;
	$thumb-size: 20px;
	$focus-ring-thickness: 10px;
	$icon-size: 20px;
	$icon-margin-right: 8px;

	@layer props {
		:comp {
			/// 图标大小。
			--icon-size: #{$icon-size};
			--icon-margin-right: #{$icon-margin-right};
		}
	}

	:comp {
		display: flex;
		align-items: center;
		cursor: pointer;

		> .icon {
			margin-right: var(--icon-margin-right);
			color: c(icon-color);
			font-size: var(--icon-size);
		}

		> .content {
			width: 100%;
			color: c(text-color);

			> * {
				display: flex;
				align-items: center;
			}

			> label.details {
				margin-top: 4px;
			}
		}
	}

	.switch {
		position: relative;
		flex-shrink: 0;
		width: $width;
		height: $thumb-size;
		touch-action: pinch-zoom;

		.base {
			@include oval;
			@include control-inner-shadow;
			position: absolute;
			top: calc(($thumb-size - $base-height) / 2);
			width: $width;
			height: $base-height;
			background-color: c(main-fg, 25%);

			:comp.on & {
				background-color: c(accent, 40%);
			}

			:comp:not(.on).disabled & {
				background-color: c(main-fg, 10%);
			}

			:comp.on.disabled & {
				background-color: c(accent-disabled, 40%);
			}
		}

		.thumb {
			@include square($thumb-size);
			@include circle;
			@include flex-center;
			@include control-ball-shadow-off;
			position: absolute;
			top: 0;
			left: 0;
			background-color: c(white);

			@include tablet {

				// 增加移动端大小以便拖拽。
				&::before {
					@include square(40px);
					@include circle;
					content: "";
					position: absolute;
				}
			}

			:comp.on & {
				left: $width - $thumb-size;
			}

			:comp.on:not(.disabled) & {
				@include control-ball-shadow;
				background-color: c(accent);
			}

			:comp:not(.on).disabled & {
				@include control-ball-shadow-off-disabled;
				background-color: c(white);

				html.dark & {
					background-color: c(gray-40);
				}
			}

			:comp.on.disabled & {
				@include control-ball-shadow-disabled;
				background-color: c(accent-disabled);
			}

			:comp:any-hover &,
			:comp:not(.on):focus-visible & {
				@include control-ball-shadow-off-hover;
			}

			:comp.on:any-hover &,
			:comp.on:not(.disabled):focus-visible & {
				@include control-ball-shadow-hover;
			}

			:comp:active & {
				transform: scale(calc(19 / 20));
			}
		}
	}

	.disabled {
		pointer-events: none;

		.dark & .switch {
			opacity: 0.7;
		}

		.dark &.on .switch {
			opacity: 0.5; // 深色主题下颜色太鲜艳了，不容易分清是否被禁用。
		}
	}
</style>
