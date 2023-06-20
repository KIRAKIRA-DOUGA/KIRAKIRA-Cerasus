<script setup lang="tsx">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { Underline } from "@tiptap/extension-underline";
	import VueComponent from "./Extension";

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			VueComponent.kaomoji,
			VueComponent.thumbVideo,
		],
		content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<thumb-video></thumb-video>
			<small-kaomoji-bar />
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`,
		autofocus: false,
		editable: true,
		injectCSS: false,
	});
	const rtfEditor = refComp();
	const showEmojiBar = ref(false);
	const inputKaomoji = "";

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
	const addSmallKaomojiList = () => { editor.value?.commands.insertContent("<small-kaomoji-bar></small-kaomoji-bar>"); };
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
		if (e.ctrlKey && e.code === "KeyM")
			addSmallKaomojiList();
	}

	/**
	 * 在光标处输入字符串。因为 click的回调不能直接用editor的方法。
	 * @param str 输入的字符串
	*/
	function enter(str: string) {
		editor.value?.commands.insertContent(str);
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
	<Comp>
		<KaomojiBar v-if="showEmojiBar" v-model="inputKaomoji" @click="enter(inputKaomoji)" />
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
