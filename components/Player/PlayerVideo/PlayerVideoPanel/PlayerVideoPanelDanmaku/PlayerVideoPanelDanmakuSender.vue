<script setup lang="ts">
	const props = defineProps<{
		getTime: Function;
		videoID: number;
	}>();

	const sendDanmaku = defineModel<DanmakuComment[]>();

	const content = ref("");
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutStyle = ref<FlyoutModel>();
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
		color: "FFFFFF",
		mode: "rtl" as DanmakuMode,
		enableRainbow: false,
	});

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

		// Insert into backend
		const api = useApi();
		api.createDanmaku(props.videoID, props.getTime(), text, style.mode, style.color.toString(), style.fontSize);

		sendDanmaku.value = [{
			text,
			mode: style.mode,
			render() {
				const div = document.createElement("div");
				div.textContent = text;
				div.classList.add("dm");
				if (style.enableRainbow) div.classList.add("dm-rainbow");
				Object.assign(div.style, {
					fontSize: fontSizes[style.fontSize] + "px",
					color: style.color ? "#" + style.color : undefined,
				});
				return div;
			},
		}];
		content.value = "";
	}
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />

	<Flyout v-model="flyoutStyle" noCropping>
		<div class="style-container">
			<Subheader icon="palette">{{ t.color }}</Subheader>
			<section class="color-section">
				<div class="color current-color" :style="{ backgroundColor: '#' + style.color }"></div>
				<div class="color-list">
					<div
						v-for="color in colors"
						:key="color"
						class="color"
						:style="{ backgroundColor: '#' + color }"
						@click="style.color = color"
					></div>
					<div class="color custom-color">
						<div class="hue"></div>
						<div class="luminance"></div>
					</div>
				</div>
			</section>
			<ToggleSwitch v-model="style.enableRainbow">{{ t.danmaku.format.send_as_creator }}</ToggleSwitch>
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
					v-tooltip:bottom="t.format"
					icon="text_format"
					appearance="textbox-trailingicon"
					:active="!!flyoutStyle"
					@click="e => flyoutStyle = [e, 'y', OFFSET_Y]"
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
		min-width: 344px;

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
					}
				}
			}
		}
	}
</style>
