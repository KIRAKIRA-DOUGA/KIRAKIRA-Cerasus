<script setup lang="ts">
	import { animateSizeGenerator } from "utils/animation";

	const flyoutFormat = defineModel<FlyoutModel>();
	const format = defineModel<DanmakuFormat | UnwrapRef<DanmakuFormat>>("format", { required: true });

	const flyout = ref<InstanceType<typeof Flyout>>();
	const colors = ["FFFFFF", "FF3225", "F06E8E", "FFA800", "FBFF34", "2CE73F", "39C5BB", "24C1F2", "DC1FED"];
	const colorModel = ref<ColorModel>();
	const styleContainer = refComp();
	const showColorPickerAnimationGenerator = ref<AsyncGenerator>();
	const _showColorPicker = ref(false);
	const showColorPicker = computed({
		get: () => _showColorPicker.value,
		set: async value => {
			showColorPickerAnimationGenerator.value = animateSizeGenerator(styleContainer, { duration: 600, noClipping: true });
			await showColorPickerAnimationGenerator.value.next();
			_showColorPicker.value = value;
		},
	});
	const placement = ref<Placement>();

	/**
	 * 切换页面时，移动浮窗到页面内部。
	 */
	function onSwitchPageEnter() {
		placement.value = undefined;
		if (flyout.value && flyoutFormat.value instanceof Array)
			flyout.value.moveIntoPage(flyoutFormat.value[0], flyoutFormat.value[1], 0);
		showColorPickerAnimationGenerator.value?.next();
	}

	/**
	 * 是否使用深色的勾图标？
	 * @param color - 颜色 HEX 值。
	 * @returns 是否是深色？
	 */
	function isDarkCheckMark(color: string) {
		return Color.fromHex(color).naturalLightness >= 0.5;
	}
</script>

<template>
	<Flyout ref="flyout" v-model="flyoutFormat" @hide="showColorPicker = false" @beforeShow="p => placement = p">
		<Comp ref="styleContainer" :class="[placement]">
			<Transition :name="showColorPicker ? 'page-forward' : 'page-backward'" mode="out-in" @enter="onSwitchPageEnter">
				<div v-if="!showColorPicker" class="page-style">
					<Subheader icon="palette">{{ t.color }}</Subheader>
					<section class="color-section">
						<div class="color current-color" :style="{ backgroundColor: format.color.hashHex }"></div>
						<div class="color-list">
							<div
								v-for="color in colors"
								:key="color"
								class="color"
								:class="{ 'dark-check': isDarkCheckMark(color), checked: format.color.hex === color }"
								:style="{ backgroundColor: '#' + color }"
								@click="format.color.hex = color"
							>
								<Icon name="check" />
							</div>
							<div
								class="color custom-color dark-check"
								:class="{ checked: !colors.includes(format.color.hex) }"
								@click="showColorPicker = true"
							>
								<div class="hue"></div>
								<div class="luminance"></div>
								<div class="stroke"></div>
								<Icon name="check" />
							</div>
						</div>
					</section>
					<ToggleSwitch v-model="format.enableRainbow">
						<div class="rainbow-example"></div>
						{{ t.danmaku.format.send_as_creator }}
					</ToggleSwitch>
					<Subheader icon="font_size">{{ t.text.size }}</Subheader>
					<Segmented v-model="format.fontSize">
						<SegmentedItem id="small" icon="font_size_small">{{ t.size.small }}</SegmentedItem>
						<SegmentedItem id="medium" icon="font_size_medium">{{ t.size.medium }}</SegmentedItem>
						<SegmentedItem id="large" icon="font_size_large">{{ t.size.large }}</SegmentedItem>
					</Segmented>
					<Subheader icon="danmaku">{{ t.mode }}</Subheader>
					<Segmented v-model="format.mode">
						<SegmentedItem id="rtl" icon="danmaku_rtl">{{ t.danmaku.format.mode.rtl }}</SegmentedItem>
						<SegmentedItem id="top" icon="danmaku_top">{{ t.danmaku.format.mode.top }}</SegmentedItem>
						<SegmentedItem id="bottom" icon="danmaku_bottom">{{ t.danmaku.format.mode.bottom }}</SegmentedItem>
						<SegmentedItem id="ltr" icon="danmaku_ltr">{{ t.danmaku.format.mode.ltr }}</SegmentedItem>
					</Segmented>
				</div>
				<div v-else class="page-color">
					<ColorPicker v-model="format.color" v-model:model="colorModel">
						<template #navigation-back>
							<SoftButton class="back" icon="arrow_left" @click="showColorPicker = false" />
						</template>
					</ColorPicker>
				</div>
			</Transition>
		</Comp>
	</Flyout>
</template>

<style scoped lang="scss">
	$format-width: 344px;

	.page-style {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-width: $format-width;

		.segmented {
			width: 100%;
		}

		.color-section {
			display: flex;
			gap: 18px;
			justify-content: space-between;

			.color {
				@include round-small;
				@include square(24px);
				@include button-shadow-unchecked-hover;
				flex-shrink: 0;
				border: c(color-palette-stroke) 2px solid;

				&.current-color {
					width: 78px;
					height: auto;
				}
			}

			.color-list {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;

				.color {
					@include flex-center;
					cursor: pointer;

					&:any-hover {
						@include button-shadow-unchecked-hover-deeper;
					}

					&:active {
						@include button-scale-pressed;
					}

					&.custom-color {
						position: relative;
						overflow: clip;
						border: none;

						* {
							position: absolute;
							inset: 0;
						}

						.hue {
							background: $hue-radial;
						}

						.luminance {
							background: $luminance-radial;
						}

						.stroke {
							@include color-palette-stroke;
						}
					}

					.icon {
						position: relative;
						color: white;
						font-size: 16px;
					}

					&.dark-check .icon {
						color: black;
					}

					&:not(.checked) .icon {
						scale: 0;
					}
				}
			}
		}
	}

	.page-color {
		$margin: 12px;
		min-width: $format-width + 12px * 2;

		.back {
			--icon-size: 20px;
			--ripple-size: 52px;

			/* display: flex;
			gap: 5px;
			margin-bottom: 10px;
			color: c(accent);
			cursor: pointer;

			&:any-hover,
			&:active {
				opacity: 0.7;
			}

			.icon {
				font-size: 18px;
			} */
		}
	}

	.rainbow-example {
		@include round-small;
		@include square(20px);
		margin-right: 8px;
		background: linear-gradient(to right, #f2509e, #308bcd) border-box;
		border: 3px solid transparent;
		mask: linear-gradient(white 0 0) padding-box, linear-gradient(white 0 0);
		mask-composite: exclude;
	}

	// stylelint-disable-next-line order/order
	@include float-in-children($selector: ":comp$placement .page-style", $length: 7, $delay: 50ms, $ease: $ease-out-smooth);
</style>
