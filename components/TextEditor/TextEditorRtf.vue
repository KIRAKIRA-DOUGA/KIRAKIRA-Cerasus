<script setup lang="tsx">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { Underline } from "@tiptap/extension-underline";
	import VueComponent from "helpers/editor-extension";
	import { SoftButton } from "#components";

	const props = defineProps<{
		/** 视频 ID。 */
		videoId: number;
	}>();

	const emits = defineEmits<{
		input: [e: InputEvent];
		keydown: [e: KeyboardEvent];
		keyup: [e: KeyboardEvent];
	}>();

	type ActiveType = string | boolean;
	const rtfEditor = refComp();
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutKaomojiMini = ref<FlyoutModel>();
	const textLength = ref(0);
	const isSendingComment = ref(false);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			VueComponent.ThumbVideo,
			VueComponent.CursorShadow,
		],
		/* content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`, */
		autofocus: false,
		editable: true,
		injectCSS: false,
		onUpdate(props) {
			textLength.value = props.editor.getText().length;
		},
		onCreate({ editor }) {
			const proseMirror = editor.view.dom;
			addEventListeners(proseMirror, "keydown", "keyup", e => stopPropagationExceptKey(e, "F11", "Ctrl + KeyM"));
			proseMirror.addEventListener("input", e => emits("input", e as InputEvent)); // e 的类型默认为 Event 而并非 InputEvent 是预期行为，参见：https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1174
			proseMirror.addEventListener("keydown", e => emits("keydown", e));
			proseMirror.addEventListener("keyup", e => emits("keyup", e));
		},
	});

	/** 切换文本加粗。 */
	const toggleBold = () => { editor.value?.chain().focus().toggleBold().run(); };
	/** 切换文本倾斜。 */
	const toggleItalic = () => { editor.value?.chain().focus().toggleItalic().run(); };
	/** 切换文本下划线。 */
	const toggleUnderline = () => { editor.value?.chain().focus().toggleUnderline().run(); };
	// 不知道为什么 StarterKit 中没提供 toggleUnderline，所以只能额外安装 @tiptap/extension-underline。
	/** 切换文本删除线。 */
	const toggleStrike = () => { editor.value?.chain().focus().toggleStrike().run(); };

	/** 在富文本编辑器光标处追加一个 Vue 组件。 */
	const addVueComponents = () => { editor.value?.commands.insertContent("<thumb-video></thumb-video>"); };
	/** 在光标处打开迷你颜文字输入面板。 */
	const showRecentKaomojis = () => { flyoutKaomojiMini.value = [getCursorPixel(), "y"]; };
	/** 打开提及面板。 */
	const showAtList = () => { };

	/**
	 * 插入颜文字。
	 * @param kaomoji - 颜文字。
	 */
	function insertKaomoji(kaomoji?: string) {
		editor.value?.commands.focus();
		kaomoji && editor.value?.commands.insertContent(kaomoji);
	}

	/**
	 * 获取文本光标位置。
	 * @returns 文本光标位置。
	 */
	function getCursorPixel() {
		if (!editor.value) return;
		const id = "cursor-" + crypto.randomUUID();
		const selection = editor.value.state.selection;
		editor.value.commands.insertContentAt(selection.$anchor.pos, `<cursor id="${id}">1</cursor>`);
		const shadow = rtfEditor.value?.querySelector(`[data-id="${id}"]`);
		const rect = shadow?.getBoundingClientRect();
		editor.value.commands.setTextSelection({ from: selection.from, to: selection.to + 1 });
		kill(shadow);
		return rect;
	}

	/**
	 * sends comment to the backend.
	 */
	async function sendComment() {
		try {
			isSendingComment.value = true;
			// TODO: // WARN 需要对用户输入的文字进行 Base64 编码
			const content = editor.value?.getText() ?? ""; // Get plain text currently to avoid web attack.
			const emitVideoCommentRequest: EmitVideoCommentRequestDto = {
				videoId: props.videoId,
				text: content,
			};
			// TODO: 虽然我很想非阻塞地发送评论，但是楼层号必须在评论成功提交给后端后才会获得。emmmm...
			const emitVideoCommentResult = await api.videoComment.emitVideoComment(emitVideoCommentRequest);
			const videoComment = emitVideoCommentResult.videoComment;
			if (emitVideoCommentResult?.success && videoComment) {
				editor.value?.commands.clearContent()
				textLength.value = 0
				useEvent("videoComment:emitVideoComment", videoComment);
				useToast(t.toast.comment_sent, "success", 5000);
			} else {
				useToast(t.toast.something_went_wrong, "error", 5000);
				console.error("ERROR", "Failed to send comment: request failed.");
			}
			isSendingComment.value = false;
		} catch (error) {
			useToast(t.toast.something_went_wrong, "error", 5000);
			console.error("ERROR", "Failed to send comment:", error);
			isSendingComment.value = false;
		}
	}

	/**
	 * 是否是激活状态？
	 * @param active - 要验证的选项，如为字符串则会在编辑器中寻找对应格式，如为布尔型则直接返回之。
	 * @returns 激活状态。
	 */
	function isActive(active?: ActiveType) {
		return typeof active === "boolean" ? active : !!active && editor.value?.isActive(active);
	}

	const ToolItem = (() => {
		interface Props {
			tooltip?: string;
			active?: ActiveType;
			disabled?: boolean;
			icon?: DeclaredIcons;
			onClick?: (e: MouseEvent) => void;
		}
		return (props => (
			<SoftButton
				v-tooltip:bottom={props.tooltip}
				active={isActive(props.active)}
				disabled={props.disabled}
				icon={props.icon}
				onClick={props.onClick}
			/>
		)) as VueJsx<Props>;
	})();

	/*
	 * 自定义快捷键侦听。
	 * 目前已有的快捷键：
	 * `Ctrl + M` - 打开颜文字快捷输入面板。
	 */
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />
	<FlyoutKaomojiMini v-model="flyoutKaomojiMini" @insert="insertKaomoji" @escape="insertKaomoji" />

	<Comp ref="rtfEditor" @keyup.stop.ctrl.m="showRecentKaomojis">
		<ClientOnly>
			<EditorContent :editor />
		</ClientOnly>
		<div class="toolbar">
			<div class="left">
				<ToolItem :tooltip="t.format.bold" icon="bold" active="bold" @click="toggleBold" />
				<ToolItem :tooltip="t.format.italic" icon="italic" active="italic" @click="toggleItalic" />
				<ToolItem :tooltip="t.format.underline" icon="underline" active="underline" @click="toggleUnderline" />
				<ToolItem :tooltip="t.format.strikethrough" icon="strikethrough" active="strike" @click="toggleStrike" />
				<ToolItem :tooltip="t.mention" icon="at" @click="showAtList" />
				<ToolItem :tooltip="t.kaomoji" icon="kaomoji" :active="!!flyoutKaomoji" @click="e => flyoutKaomoji = [e, 'y', -3]" />
				<ToolItem :tooltip="t.image" icon="photo" @click="addVueComponents" />
			</div>
			<div class="right">
				<span class="text-length">{{ textLength }}</span>
				<ToolItem :tooltip="t.send" icon="send" :disabled="!textLength || isSendingComment" :loading="isSendingComment" @click="sendComment" />
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include control-inner-shadow;
		overflow: clip;
		background-color: c(inset-bg);

		> :first-child {
			display: block;
			min-height: 3em;
			padding: 12px;
		}

		.toolbar {
			@include round-large(bottom);
			@include card-in-card-shadow;
			$height: 36px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: $height;
			padding-right: 4px;
			overflow: clip;

			.left {
				@include no-scrollar;
				overflow: auto clip;
			}

			> * {
				display: flex;
				gap: 4px;
				align-items: center;

				.soft-button {
					--wrapper-size: #{$height};
					--icon-size: 20px;
				}

				.text-length {
					display: block;
					margin: 0 8px;
					color: c(icon-color);
					font-variant-numeric: tabular-nums;
				}
			}
		}
	}
</style>
