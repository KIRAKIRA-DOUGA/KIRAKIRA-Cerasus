<script setup lang="ts">
	const sendDanmaku = defineModel<DanmakuComment>();

	const content = ref("");
	const flyoutKaomoji = ref<FlyoutModel>();
	const textBox = ref<InstanceType<typeof TextBox>>();

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
		sendDanmaku.value = {
			text: content.value,
			style: {
				fontSize: "20px",
				color: "#ffffff",
			},
		};
		content.value = "";
	}
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />

	<Comp role="textbox">
		<TextBox ref="textBox" v-model="content" :placeholder="t.send_danmaku">
			<template #actions>
				<SoftButton icon="kaomoji" appearance="textbox-trailingicon" :active="!!flyoutKaomoji" @click="e => flyoutKaomoji = [e, 'y', -5.4]" />
				<SoftButton icon="text_format" appearance="textbox-trailingicon" />
				<SoftButton :disabled="!content" icon="send" appearance="textbox-trailingicon" @click="onSend" />
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
</style>
