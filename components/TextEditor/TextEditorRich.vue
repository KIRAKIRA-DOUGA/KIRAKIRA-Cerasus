<script setup lang="tsx">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import VueComponent from "./Extension";

	const editor = useEditor({
		extensions: [
			StarterKit,
			VueComponent.emoji,
			VueComponent.thumbVideo,
		],
		content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<thumb-video></thumb-video>
			<EmojiBar />
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`,
		autofocus: false,
		editable: true,
		injectCSS: false,
	});
	const rtfEditor = refComp();
	const showEmojiBar = ref(false);
	const emojis = [..."ashgdamhs"];

	/** 切换文本加粗。 */
	const toggleBold = () => { editor.value?.chain().focus().toggleBold().run(); };
	/** 切换文本倾斜。 */
	const toggleItalic = () => { editor.value?.chain().focus().toggleItalic().run(); };
	/** 切换文本下划线。 */
	const toggleUnderline = () => { editor.value?.chain().focus().toggleUnderline().run(); };
	// FIXME: 类型“ChainedCommands”上不存在属性“toggleUnderline” (wtf?)。回去重装一下完整版的 Tiptap，这个精简版本少功能。
	/** 切换文本删除线。 */
	const toggleStrike = () => { editor.value?.chain().focus().toggleStrike().run(); };

	/** 在富文本编辑器光标处追加一个 Vue 组件。 */
	const addVueComponents = () => { editor.value?.commands.insertContent("<thumb-video></thumb-video>"); };
	/** 在光标处新增颜文字。 */
	const addKaomojiList = () => { editor.value?.commands.insertContent("<emoji-bar></emoji-bar>"); };
	/** 打开艾特页面。 */
	const addAtList = () => { };

	/**
	 * 自定义快捷键侦听。
	 *
	 * 目前已有的快捷键：
	 *
	 * `Ctrl + M` - 打开颜文字快捷输入面板。
	 * @param e - 键盘侦听事件。
	 */
	function shortCut(e: KeyboardEvent) {
		if (e.ctrlKey && e.key === "m")
			addKaomojiList();
	}

	useEventListener("window", "keyup", e => {
		if (rtfEditor.value && getPath(e.target).includes(rtfEditor.value))
			shortCut(e);
	});

	const ToolItem = (() => {
		interface Props {
			active: string;
			onClick?: () => void;
		}
		return ((props, { slots }) => (
			<button v-ripple class={{ active: editor.value?.isActive(props.active) }} onClick={props.onClick}>
				{slots.default()}
			</button>
		)) as VueJsx<Props>;
	})();
</script>

<template>
	<Comp ref="rtfEditor" role="application">
		<EmojiBar v-if="showEmojiBar" :emoji="emojis" class="emoji-bar" />
		<div class="toolbar">
			<button v-ripple @click="showEmojiBar = !showEmojiBar"><Icon name="kaomoji" class="icon" style="scale: 2.5 ;" /></button>
			<button v-ripple @click="addAtList"><Icon name="at" class="icon" /></button>
			<ToolItem active="bold" @click="toggleBold"><Icon name="bold" class="icon" /></ToolItem>
			<ToolItem active="italic" @click="toggleItalic"><Icon name="italic" class="icon" /></ToolItem>
			<!-- <ToolItem active="underline" @click="toggleUnderline"><u>U</u></ToolItem> -->
			<ToolItem active="strike" @click="toggleStrike"><Icon name="strike" class="icon" /></ToolItem>
			<button v-ripple @click="addVueComponents"><Icon name="photo" class="icon" /></button>

		</div>
		<EditorContent :editor="editor" />
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include radius-large;
		@include card-shadow;
		background-color: c(main-bg);

		> * {
			padding: 12px;
		}

		.icon {
			color: #797173;
			scale: 1.5;
		}

		.emoji-bar {
			position: relative;
			display: flex;
		}

		.toolbar {
			@include card-in-card-shadow;
			display: flex;
			gap: 3px;

			> * {
				@include radius-small;
				@include flex-center;
				$size: 28px;
				min-width: $size;
				height: $size;
				padding: 0 6px;

				&:hover {
					background-color: c(hover-color);
				}

				&.active {
					color: white;
					background-color: c(accent);

					&:focus {
						@include button-shadow-focus;
					}
				}

				&:focus {
					@include button-shadow-unchecked-focus;
				}
			}
		}
	}
</style>
