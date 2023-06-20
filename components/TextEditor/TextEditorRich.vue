<script setup lang="tsx">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { Underline } from "@tiptap/extension-underline";
	import VueComponent from "./Extension";

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			VueComponent,
		],
		content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<thumb-video></thumb-video>
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`,
		autofocus: false,
		editable: true,
		injectCSS: false,
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
	/** 打开颜文字页面。 */
	const addKaomojiList = () => { };

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
		<div class="toolbar">
			<ToolItem active="bold" @click="toggleBold"><b>B</b></ToolItem>
			<ToolItem active="italic" @click="toggleItalic"><i>I</i></ToolItem>
			<ToolItem active="underline" @click="toggleUnderline"><u>U</u></ToolItem>
			<ToolItem active="strike" @click="toggleStrike"><s>S</s></ToolItem>
			<button v-ripple @click="addVueComponents"><Icon name="photo" /></button>
			<button v-ripple @click="addKaomojiList">(·ω·)</button>
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
