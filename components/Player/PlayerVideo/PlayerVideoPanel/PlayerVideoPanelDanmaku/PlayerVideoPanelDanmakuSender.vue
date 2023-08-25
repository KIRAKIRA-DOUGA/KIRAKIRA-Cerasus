<script setup lang="ts">
	const sendDanmaku = defineModel<DanmakuComment>();

	const content = ref("");
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutStyle = ref<FlyoutModel>();
	const textBox = ref<InstanceType<typeof TextBox>>();
	const OFFSET_Y = -5.4;
	type DanmakuMode = NonNull<DanmakuComment["mode"]>;
	const style = reactive({
		fontSize: String(20),
		color: "#ffffff",
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
		sendDanmaku.value = {
			text,
			mode: style.mode,
			render() {
				const div = document.createElement("div");
				div.textContent = text;
				div.classList.add("dm");
				if (style.enableRainbow) div.classList.add("dm-rainbow");
				Object.assign(div.style, {
					fontSize: style.fontSize + "px",
					color: style.color || undefined,
				});
				return div;
			},
		};
		content.value = "";
	}
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />
	
	<Flyout v-model="flyoutStyle" noCropping>
		<div class="style-container">
			<span>字号</span>
			<TextBox
				v-model="style.fontSize"
				type="number"
				:min="4"
				:max="64"
				:step="1"
			/>
			<span>模式</span>
			<ComboBox v-model="style.mode">
				<ComboBoxItem id="rtl">滚动</ComboBoxItem>
				<ComboBoxItem id="top">顶部</ComboBoxItem>
				<ComboBoxItem id="bottom">底部</ComboBoxItem>
				<ComboBoxItem id="ltr">逆向</ComboBoxItem>
			</ComboBox>
			<span>颜色</span>
			<div class="color-wrapper">
				<div class="color" :style="{ backgroundColor: style.color }"></div>
				<TextBox v-model="style.color" />
			</div>
			<ToggleSwitch v-model="style.enableRainbow">某大会员专属颜色</ToggleSwitch>
		</div>
	</Flyout>

	<Comp role="textbox">
		<TextBox ref="textBox" v-model="content" :placeholder="t.send_danmaku">
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
		display: grid;
		grid-template-columns: auto 200px;
		gap: 10px;
		align-items: center;
		
		.color-wrapper {
			display: flex;
			gap: 10px;

			.color {
				@include round-small;
				width: 3rem;
			}
			
			.text-box {
				width: 100%;
			}
		}
		
		.toggle-switch {
			grid-column-end: span 2;
		}
	}
</style>
