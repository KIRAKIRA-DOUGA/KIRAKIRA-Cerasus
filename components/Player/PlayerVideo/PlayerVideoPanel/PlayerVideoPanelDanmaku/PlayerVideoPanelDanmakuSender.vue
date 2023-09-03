<script setup lang="ts">
	import { animateSizeGenerator } from "utils/animation";
	import { FlyoutModelNS } from "types/arguments";

	const sendDanmaku = defineModel<DanmakuComment>();

	const content = ref("");
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutStyle = ref<FlyoutModel>();
	const flyout = ref<InstanceType<typeof Flyout>>();
	const textBox = ref<InstanceType<typeof TextBox>>();
	const OFFSET_Y = -5.4;
	type DanmakuMode = NonNull<DanmakuComment["mode"]>;
	const colors = ["FFFFFF", "FF3225", "F06E8E", "FFA800", "FBFF34", "2CE73F", "39C5BB", "24C1F2", "DC1FED"];
	const fontSizes = {
		small: 14,
		medium: 20,
		large: 28,
	};
	const style = reactive({
		fontSize: "medium" as keyof typeof fontSizes,
		color: Color.fromHex("#FFFFFF"),
		mode: "rtl" as DanmakuMode,
		enableRainbow: false,
	});
	const colorModel = ref<ColorModel>();
	const styleContainer = ref<HTMLDivElement>();
	const showColorPickerAnimationGenerator = ref<AsyncGenerator>();
	const _showColorPicker = ref(false);
	const showColorPicker = computed({
		get: () => _showColorPicker.value,
		set: async value => {
			showColorPickerAnimationGenerator.value = animateSizeGenerator(styleContainer, { duration: 600, noCropping: true });
			await showColorPickerAnimationGenerator.value.next();
			_showColorPicker.value = value;
		},
	});

	/**
	 * 切换页面时，移动浮窗到页面内部。
	 */
	function onSwitchPageEnter() {
		if (flyout.value && flyoutStyle.value instanceof Array)
			flyout.value.moveIntoPage(flyoutStyle.value[0], flyoutStyle.value[1], 0);
		showColorPickerAnimationGenerator.value?.next();
	}

	/**
	 * 插入颜文字。
	 * @param kaomoji - 颜文字。
	 */
	function insertKaomoji(kaomoji?: string) {
		const { input } = textBox.value!;
		if (!input) return;
		insertTextToTextBox(input, kaomoji);
		content.value = input.value;
	}

	/**
	 * 发送弹幕事件。
	 */
	function onSend() {
		if (!content.value) return;
		const text = content.value;
		sendDanmaku.value = {
			text,
			mode: style.mode,
			render() {
				const div = document.createElement("div");
				div.textContent = text;
				div.classList.add("dm");
				if (style.enableRainbow) div.classList.add("dm-rainbow");
				Object.assign(div.style, {
					fontSize: fontSizes[style.fontSize] + "px",
					color: style.color ? style.color.hashHex : undefined,
				});
				return div;
			},
		};
		content.value = "";
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
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />

	<Flyout ref="flyout" v-model="flyoutStyle" @hide="showColorPicker = false">
		<div ref="styleContainer">
			<Transition :name="showColorPicker ? 'page-forward' : 'page-backward'" mode="out-in" @enter="onSwitchPageEnter">
				<div v-if="!showColorPicker" class="style-container">
					<Subheader icon="palette">{{ t.color }}</Subheader>
					<section class="color-section">
						<div class="color current-color" :style="{ backgroundColor: style.color.hashHex }"></div>
						<div class="color-list">
							<div
								v-for="color in colors"
								:key="color"
								class="color"
								:class="{ 'dark-check': isDarkCheckMark(color), checked: style.color.hex === color }"
								:style="{ backgroundColor: '#' + color }"
								@click="style.color.hex = color"
							>
								<Icon name="check" />
							</div>
							<div
								class="color custom-color dark-check"
								:class="{ checked: !colors.includes(style.color.hex) }"
								@click="showColorPicker = true"
							>
								<div class="hue"></div>
								<div class="luminance"></div>
								<div class="stroke"></div>
								<Icon name="check" />
							</div>
						</div>
					</section>
					<ToggleSwitch v-model="style.enableRainbow">
						<div class="rainbow-example"></div>
						{{ t.danmaku.format.send_as_creator }}
					</ToggleSwitch>
					<Subheader icon="font_size">{{ t.text.size }}</Subheader>
					<Segmented v-model="style.fontSize">
						<SegmentedItem id="small" icon="font_size_small">{{ t.size.small }}</SegmentedItem>
						<SegmentedItem id="medium" icon="font_size_medium">{{ t.size.medium }}</SegmentedItem>
						<SegmentedItem id="large" icon="font_size_large">{{ t.size.large }}</SegmentedItem>
					</Segmented>
					<Subheader icon="danmaku">{{ t.mode }}</Subheader>
					<Segmented v-model="style.mode">
						<SegmentedItem id="rtl" icon="danmaku_rtl">{{ t.danmaku.format.mode.rtl }}</SegmentedItem>
						<SegmentedItem id="top" icon="danmaku_top">{{ t.danmaku.format.mode.top }}</SegmentedItem>
						<SegmentedItem id="bottom" icon="danmaku_bottom">{{ t.danmaku.format.mode.bottom }}</SegmentedItem>
						<SegmentedItem id="ltr" icon="danmaku_ltr">{{ t.danmaku.format.mode.ltr }}</SegmentedItem>
					</Segmented>
				</div>
				<div v-else class="color-container">
					<p class="back" @click="showColorPicker = false"><Icon name="arrow_left" />返回</p>
					<ColorPicker v-model="style.color" v-model:model="colorModel" />
				</div>
			</Transition>
		</div>
	</Flyout>

	<Comp role="textbox">
		<TextBox ref="textBox" v-model="content" :placeholder="t.danmaku.send">
			<template #actions>
				<SoftButton
					v-tooltip:bottom="t.kaomoji"
					icon="kaomoji"
					appearance="textbox-trailingicon"
					:active="!!flyoutKaomoji"
					@click="e => flyoutKaomoji = [e, 'y', OFFSET_Y]"
				/>
				<SoftButton
					icon="text_format"
					appearance="textbox-trailingicon"
					:active="!!flyoutStyle"
					@click="e => flyoutStyle = [e.currentTarget, 'y', OFFSET_Y]"
				/>
				<SoftButton
					v-tooltip:bottom="t.send"
					:disabled="!content"
					icon="send"
					appearance="textbox-trailingicon"
					@click="onSend"
				/>
			</template>
		</TextBox>
	</Comp>
</template>

<style scoped lang="scss">
	$format-width: 344px;

	:comp {
		display: flex;
		flex-shrink: 0;
		width: 100%;
		height: 36px;

		.text-box {
			--square: true;
			width: 100%;
		}
	}

	.style-container {
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
						overflow: hidden;
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
	
	.color-container {
		$margin: 12px;
		min-width: $format-width + 12px * 2;
		margin: 0 #{-$margin};
		
		.back {
			display: flex;
			gap: 5px;
			margin: 0 $margin 10px;
			color: c(accent);
			cursor: pointer;
			
			&:any-hover,
			&:active {
				opacity: 0.7;
			}
			
			.icon {
				font-size: 18px;
			}
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
</style>
