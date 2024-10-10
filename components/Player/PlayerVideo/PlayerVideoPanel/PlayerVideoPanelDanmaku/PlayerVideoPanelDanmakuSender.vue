<script lang="ts">
	const fontSizes = {
		small: 14,
		medium: 20,
		large: 28,
	};

	/**
	 * 基础发射弹幕样式。
	 */
	export const basicDanmakuCommentStyle = {
		fontWeight: "bold",
		textShadow: "1px 0 1px black, 0 1px 1px black, 0 -1px 1px black, -1px 0 1px black",
	};

	/**
	 * 创建一个可发射的弹幕内容。
	 * @param text - 弹幕内容。
	 * @param time - 弹幕出现时间。
	 * @param format - 弹幕格式。
	 * @returns 可发射的弹幕内容。
	 */
	export function createDanmakuComment(text: string, time: number | undefined, format: DanmakuFormat): DanmakuComment {
		return {
			text,
			time,
			mode: format.mode,
			render() {
				const div = document.createElement("div");
				div.textContent = text;
				div.classList.add("dm");
				if (format.enableRainbow) div.classList.add("dm-rainbow");
				Object.assign(div.style, {
					...basicDanmakuCommentStyle,
					fontSize: `${fontSizes[format.fontSize]}px`,
					color: format.color ? format.color.hashHex : undefined,
					border: "1px solid #337ab7", // 用户刚刚发**射**的弹幕会有一个蓝色框
				});
				return div;
			},
		};
	}
</script>

<script setup lang="ts">
	const props = defineProps<{
		/** 当前视频时间。 */
		currentTime: number;
		/** 视频 ID。 */
		videoId: number;
	}>();

	const sendDanmaku = defineModel<DanmakuComment[]>();

	const content = ref("");
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutFormat = ref<FlyoutModel>();
	const textBox = ref<InstanceType<typeof TextBox>>();
	const OFFSET_Y = -5.4;
	const format = reactive({
		fontSize: "medium",
		color: Color.fromHex("#FFFFFF"),
		mode: "rtl",
		enableRainbow: false,
	}) as DanmakuFormat;

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

		const emitDanmakuRequestData: EmitDanmakuRequestDto = {
			videoId: props.videoId,
			time: props.currentTime || 0,
			text,
			color: format.color.hex,
			fontSize: format.fontSize,
			mode: format.mode,
			enableRainbow: format.enableRainbow,
		};

		try {
			api.danmaku.emitDanmaku(emitDanmakuRequestData).then(emitDanmakuResult => {
				if (!emitDanmakuResult.success) {
					useToast("弹幕发送失败", "error"); // TODO: 使用多语言
					console.error("ERROR", "弹幕发送失败");
				}
			});
		} catch (error) {
			useToast("弹幕发送失败，请求失败", "error"); // TODO: 使用多语言
			console.error("ERROR", "弹幕发送失败，请求失败：", error);
		}

		sendDanmaku.value = [createDanmakuComment(text, undefined, format)];
		content.value = "";
	}
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />
	<FlyoutDanmakuFormat v-model="flyoutFormat" v-model:format="format" />

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
					:active="!!flyoutFormat"
					@click="e => flyoutFormat = [e.currentTarget, 'y', OFFSET_Y]"
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
</style>
