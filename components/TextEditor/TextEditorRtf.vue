<script setup lang="ts">
	import { useEditor, EditorContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { Underline } from "@tiptap/extension-underline";
	import VueComponent from "helpers/editor-extension";

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			VueComponent.ThumbVideo,
			VueComponent.CursorShadow,
		],
		content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`,
		autofocus: false,
		editable: true,
		injectCSS: false,
	});

	type ActiveType = string | boolean;
	const rtfEditor = refComp();
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutKaomojiMini = ref<FlyoutModel>();
	const [DefineToolItem, ToolItem] = createReusableTemplate<{
		tooltip?: string;
		active?: ActiveType;
		icon?: string;
		onClick?: (e: MouseEvent) => void;
	}>();

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
	 * 是否是激活状态？
	 * @param active - 要验证的选项，如为字符串则会在编辑器中寻找对应格式，如为布尔型则直接返回之。
	 * @returns 激活状态。
	 */
	function isActive(active?: ActiveType) {
		return typeof active === "boolean" ? active : active && editor.value?.isActive(active);
	}

	/*
	 * 自定义快捷键侦听。
	 * 目前已有的快捷键：
	 * `Ctrl + M` - 打开颜文字快捷输入面板。
	 */
</script>

<template>
	<DefineToolItem v-slot="{ tooltip, active, icon, onClick, $slots }">
		<button
			v-ripple
			v-tooltip:top="tooltip"
			:class="{ active: isActive(active) }"
			@click="onClick"
		>
			<Icon v-if="icon" :name="icon" />
			<component :is="$slots.default!" />
		</button>
	</DefineToolItem>

	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />
	<FlyoutKaomojiMini v-model="flyoutKaomojiMini" @insert="insertKaomoji" @escape="insertKaomoji" />

	<Comp ref="rtfEditor" @keyup.stop.ctrl.m="showRecentKaomojis">
		<div class="toolbar">
			<ToolItem :tooltip="t.bold" icon="bold" active="bold" @click="toggleBold" />
			<ToolItem :tooltip="t.italic" icon="italic" active="italic" @click="toggleItalic" />
			<ToolItem :tooltip="t.underline" icon="underline" active="underline" @click="toggleUnderline" />
			<ToolItem :tooltip="t.strikethrough" icon="strikethrough" active="strike" @click="toggleStrike" />
			<ToolItem :tooltip="t.at_person" icon="at" @click="showAtList" />
			<ToolItem :tooltip="t.kaomoji" icon="kaomoji" :active="!!flyoutKaomoji" @click="e => flyoutKaomoji = [e, 'y']" />
			<ToolItem :tooltip="t.image" icon="photo" @click="addVueComponents" />
		</div>
		<ClientOnly>
			<EditorContent :editor="editor" />
		</ClientOnly>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include card-shadow;
		background-color: c(main-bg);

		> :not(:empty) {
			padding: 12px;
		}

		.toolbar {
			@include card-in-card-shadow;
			display: flex;
			gap: 3px;

			> button {
				@include round-small;
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
					background-color: c(hover-film);
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
../../helpers/Extension
