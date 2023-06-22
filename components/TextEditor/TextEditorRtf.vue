<script setup lang="ts">
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
	const flyoutKaomoji = refFlyout();
	const [DefineToolItem, ToolItem] = createReusableTemplate<{ active?: string; icon?: string; onClick?: (e: MouseEvent) => void }>();
	provide("editor", editor);

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
	/** 打开提及页面。 */
	const addAtList = () => { };

	/**
	 * 自定义快捷键侦听。
	 * 目前已有的快捷键：
	 * `Ctrl + M` - 打开颜文字快捷输入面板。
	 */
	useEventListener(rtfEditor, "keyup", e => {
		if (e.ctrlKey && e.code === "KeyM") {
			addSmallKaomojiList();
			stopEvent(e);
		}
	});
</script>

<template>
	<DefineToolItem v-slot="{ active, icon, onClick, $slots }">
		<button
			v-ripple
			:class="{ active: active && editor?.isActive(active) }"
			@click="onClick"
		>
			<Icon v-if="icon" :name="icon" />
			<component :is="$slots.default!" />
		</button>
	</DefineToolItem>
	
	<Comp ref="rtfEditor">
		<FlyoutKaomoji ref="flyoutKaomoji" />
		<div class="toolbar">
			<ToolItem icon="bold" active="bold" @click="toggleBold" />
			<ToolItem icon="italic" active="italic" @click="toggleItalic" />
			<ToolItem icon="underline" active="underline" @click="toggleUnderline" />
			<ToolItem icon="strikethrough" active="strike" @click="toggleStrike" />
			<ToolItem icon="at" @click="addAtList" />
			<ToolItem icon="kaomoji" @click="e => flyoutKaomoji?.show(e, 'y')" />
			<ToolItem icon="photo" @click="addVueComponents" />
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

			> button {
				@include radius-small;
				@include flex-center;
				$size: 28px;
				min-width: $size;
				height: $size;
				padding: 0 6px;
				color: c(icon-color);
				
				.icon {
					font-size: 20px;
				}

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
