<script setup lang="tsx">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { Underline } from "@tiptap/extension-underline";
	import VueComponent from "helpers/editor-extension";
	import { SoftButton } from "#components";

	const props = defineProps<{
		/** 视频 ID。 */
		videoId?: number;
	}>();

	type ActiveType = string | boolean;
	const rtfEditor = refComp();
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutKaomojiMini = ref<FlyoutModel>();
	const textLength = ref(0);

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
	function sendComment() {
		const api = useApi();
		const content = editor.value?.getHTML() ?? "";
		const utf8Encode = new TextEncoder();
		const encodedContent = utf8Encode.encode(content) as unknown as string;

		// TODO: video ID
		api.comment(0, encodedContent, props.videoId!).then(video => {
			// TODO
		}).catch(error => console.error(error));
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
			icon?: string;
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
			<EditorContent :editor="editor" />
		</ClientOnly>
		<div class="toolbar">
			<div class="left">
				<ToolItem :tooltip="t.bold" icon="bold" active="bold" @click="toggleBold" />
				<ToolItem :tooltip="t.italic" icon="italic" active="italic" @click="toggleItalic" />
				<ToolItem :tooltip="t.underline" icon="underline" active="underline" @click="toggleUnderline" />
				<ToolItem :tooltip="t.strikethrough" icon="strikethrough" active="strike" @click="toggleStrike" />
				<ToolItem :tooltip="t.at_person" icon="at" @click="showAtList" />
				<ToolItem :tooltip="t.kaomoji" icon="kaomoji" :active="!!flyoutKaomoji" @click="e => flyoutKaomoji = [e, 'y', -3]" />
				<ToolItem :tooltip="t.image" icon="photo" @click="addVueComponents" />
			</div>
			<div class="right">
				<span class="text-length">{{ textLength }}</span>
				<ToolItem :tooltip="t.send" icon="send" :disabled="!textLength" @click="sendComment" />
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include control-inner-shadow;
		overflow: hidden;
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
			align-items: center;
			justify-content: space-between;
			height: $height;
			padding: 0 8px;
			overflow: hidden;

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
				}
			}
		}
	}
</style>
