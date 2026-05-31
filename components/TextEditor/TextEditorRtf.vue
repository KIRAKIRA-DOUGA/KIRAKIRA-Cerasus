<script setup lang="tsx">
	import { useEditor, EditorContent, type JSONContent } from "@tiptap/vue-3";
	import StarterKit from "@tiptap/starter-kit";
	import { Underline } from "@tiptap/extension-underline";
	import VueComponent from "helpers/editor-extension";
	import { SoftButton } from "#components";
	const { t } = useI18n();

	const props = defineProps<{
		/** 是否可以编辑 */
		editable: boolean;
		/** 开启的编辑功能列表 */
		editorFeatures:
			"_ALL_" | // "_ALL_" 代表启用全部功能
			(
				"bold" | // 加粗
				"italic" | // 斜体
				"underline" | // 下划线
				"strike" | 	// 删除线
				"mention" | // 提及（艾特 @）
				"kaomoji" | // 颜文字
				"video-component" // 插入视频组件
			)[];
		/** 是否必填 */
		required?: boolean; // TODO: 暂时没有实现必填功能
		/** 是否可提交（如果为假值，则不显示提交按钮，适用于仅需要编辑功能的场景，如视频简介编辑） */
		submittable?: boolean;
		/** 是否正在提交 */
		isSubmitting?: boolean;
	}>();

	const emits = defineEmits<{
		/** 提交 */
		handleSubmit: [
			contentJson: JSONContent, // 编辑器当前的 JSON 内容
			contentText: string, // 编辑器当前的纯文本内容
			clearContent: () => void, // 清空内容的回调函数，调用后会清空编辑器内容并将文本长度重置为 0
		];
		update: [ // 内容更新时触发
			contentJson: JSONContent, // 编辑器当前的 JSON 内容
			contentText: string, // 编辑器当前的纯文本内容
		];
		input: [e: InputEvent];
		keydown: [e: KeyboardEvent];
		keyup: [e: KeyboardEvent];
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
		content: !props.editable ? t("block_and_hide.toasts.cannot_send_comments_because_blocked") : undefined,
		/* content: `
			<p>我正在用 Vue.js 运行 Tiptap。🎉</p>
			<p>你看到了吗？这是 Vue 组件。我们真的生活在未来。</p>
		`, */
		autofocus: false,
		editable: props.editable,
		injectCSS: false,
		onUpdate(props) {
			const contentText = props.editor.getText();
			const contentJson = props.editor.getJSON();
			textLength.value = contentText.length;
			emits("update", contentJson, contentText);
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
	const toggleBold = () => { checkFeatureEnabled("bold") && editor.value?.chain().focus().toggleBold().run(); };
	/** 切换文本倾斜。 */
	const toggleItalic = () => { checkFeatureEnabled("italic") && editor.value?.chain().focus().toggleItalic().run(); };
	/** 切换文本下划线。 */
	const toggleUnderline = () => { checkFeatureEnabled("underline") && editor.value?.chain().focus().toggleUnderline().run(); };
	// 不知道为什么 StarterKit 中没提供 toggleUnderline，所以只能额外安装 @tiptap/extension-underline。
	/** 切换文本删除线。 */
	const toggleStrike = () => { checkFeatureEnabled("strike") && editor.value?.chain().focus().toggleStrike().run(); };

	/** 在富文本编辑器光标处追加一个 Vue 组件。 */
	const addVueComponents = () => { checkFeatureEnabled("video-component") && editor.value?.commands.insertContent("<thumb-video></thumb-video>"); };
	/** 在光标处打开迷你颜文字输入面板。 */
	const showRecentKaomojis = () => { checkFeatureEnabled("kaomoji") && (flyoutKaomojiMini.value = [getCursorPixel(), "y"]); };
	/** 打开提及面板。 */
	const showAtList = () => {
		checkFeatureEnabled("mention") && true // TODO: 打开提及面板
	};

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
	 * 检查富文本功能是否启用
	 * @param feature 
	 */
	function checkFeatureEnabled(feature: string) {
		return (typeof props.editorFeatures === "string" && props.editorFeatures === "_ALL_") || (Array.isArray(props.editorFeatures) && props.editorFeatures.includes(feature));
	}

	/**
	 * 清理编辑器内容并重置文本长度。
	 */
	function clearContent() {
		editor.value?.commands.clearContent();
		textLength.value = 0;
	}

	/**
	 * 提交内容。
	 * 将编辑器中的文本内容发送给父组件，并提供一个回调函数以清空编辑器内容和重置文本长度。
	 */
	function submit() {
		if (!props.editable || !textLength.value || props.isSubmitting) return;
		emits("handleSubmit", editor.value?.getJSON() ?? {}, editor.value?.getText() ?? "", clearContent);
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
				<ToolItem v-if="checkFeatureEnabled('bold')" :tooltip="$t('format.bold')" icon="format_bold" active="bold" @click="toggleBold" :disabled="!props.editable" />
				<ToolItem v-if="checkFeatureEnabled('italic')" :tooltip="$t('format.italic')" icon="format_italic" active="italic" @click="toggleItalic" :disabled="!props.editable" />
				<ToolItem v-if="checkFeatureEnabled('underline')" :tooltip="$t('format.underline')" icon="format_underline" active="underline" @click="toggleUnderline" :disabled="!props.editable" />
				<ToolItem v-if="checkFeatureEnabled('strike')" :tooltip="$t('format.strikethrough')" icon="format_strikethrough" active="strike" @click="toggleStrike" :disabled="!props.editable" />
				<ToolItem v-if="checkFeatureEnabled('mention')" :tooltip="$t('mention')" icon="at" @click="showAtList" :disabled="!props.editable" />
				<ToolItem v-if="checkFeatureEnabled('kaomoji')" :tooltip="$t('kaomoji.title')" icon="kaomoji" :active="!!flyoutKaomoji" @click="(e: MouseEvent) => flyoutKaomoji = [e, 'y', -3]" :disabled="!props.editable" />
				<ToolItem v-if="checkFeatureEnabled('video-component')" :tooltip="$t('image')" icon="photo" @click="addVueComponents" :disabled="!props.editable" />
			</div>
			<div class="right">
				<span class="text-length">{{ textLength }}</span>
				<ToolItem v-if="submittable" :tooltip="$t('send')" icon="send" :disabled="!textLength || isSubmitting || !props.editable" :loading="isSubmitting" @click="submit" />
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
