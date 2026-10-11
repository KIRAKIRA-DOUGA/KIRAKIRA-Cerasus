<script setup lang="tsx">
	import { Underline } from "@tiptap/extension-underline";
	import StarterKit from "@tiptap/starter-kit";
	import { type Editor, EditorContent, type JSONContent, useEditor } from "@tiptap/vue-3";
	import VueComponent, { getEditorContentLength, isSafeEditorLink } from "helpers/editor-extension";
	import { h, resolveDirective, withDirectives } from "vue";
	import { SoftButton } from "#components";

	const { t } = useI18n();

	type EditorFeature =
		"bold" |
		"italic" |
		"underline" |
		"link" |
		"strike" |
		"clear-format" |
		"heading" |
		"text-color" |
		"code" |
		"code-block" |
		"blockquote" |
		"bullet-list" |
		"ordered-list" |
		"mention" |
		"kaomoji" |
		"video-component";

	interface EditorFeatureConfig {
		/** Functions shown directly in the toolbar. */
		direct?: EditorFeature[];
		/** Functions shown in the plus menu. */
		menu?: EditorFeature[];
	}

	const FEATURE_ORDER: EditorFeature[] = [
		"bold",
		"italic",
		"underline",
		"link",
		"strike",
		"code-block",
		"kaomoji",
		"heading",
		"text-color",
		"code",
		"blockquote",
		"bullet-list",
		"ordered-list",
		"clear-format",
		"video-component",
		"mention",
	];
	const DEFAULT_DIRECT_FEATURES: EditorFeature[] = ["bold", "italic", "underline", "link", "strike", "code-block", "kaomoji", "video-component"];
	const DEFAULT_MENU_FEATURES = FEATURE_ORDER.filter(feature => !DEFAULT_DIRECT_FEATURES.includes(feature));
	const headingLevels = [1, 2, 3, 4, 5, 6] as const;

	const props = defineProps<{
		/** 是否可以编辑 */
		editable: boolean;
		/** 开启的编辑功能及其显示位置。数组写法兼容旧调用，功能会全部直显。 */
		editorFeatures: "_ALL_" | EditorFeature[] | EditorFeatureConfig;
		/** 是否必填 */
		required?: boolean;
		/** 最大内容长度；嵌入组件也会占用一个字符。 */
		maxLength?: number;
		/** 编辑区最大高度（像素），超出后在编辑区内滚动。 */
		maxContentHeight?: number;
		/** 编辑器创建时使用的 JSON 内容或旧版纯文本内容。 */
		initialContent?: JSONContent | string;
		/** 是否可提交（如果为假值，则不显示提交按钮，适用于仅需要编辑功能的场景，如视频简介编辑） */
		submittable?: boolean;
		/** 是否正在提交 */
		isSubmitting?: boolean;
	}>();

	const emits = defineEmits<{
		/** 提交 */
		handleSubmit: [
			contentJson: JSONContent,
			contentText: string,
			clearContent: () => void,
		];
		update: [contentJson: JSONContent, contentText: string];
		input: [e: InputEvent];
		keydown: [e: KeyboardEvent];
		keyup: [e: KeyboardEvent];
	}>();

	type ActiveType = string | boolean;
	const rtfEditor = refComp();
	const flyoutKaomoji = ref<FlyoutModel>();
	const flyoutKaomojiMini = ref<FlyoutModel>();
	const flyoutLink = ref<FlyoutModel>();
	const menuHeading = ref<FlyoutModel>();
	const menuMore = ref<FlyoutModel>();
	const colorInput = ref<HTMLInputElement>();
	const linkUrl = ref("");
	const linkInvalid = ref(false);
	const textLength = ref(0);
	const hasRequiredContent = ref(false);
	const validationRequested = ref(false);
	const isEmpty = computed(() => !hasRequiredContent.value);
	const isInvalid = computed(() => !!props.required && validationRequested.value && isEmpty.value);
	const isLengthLimitReached = computed(() => props.maxLength !== undefined && textLength.value >= props.maxLength);

	// Sort and deduplicate a feature list using the stable toolbar order.
	function normalizeFeatureOrder(features: EditorFeature[] = []) {
		const featureSet = new Set(features);
		return FEATURE_ORDER.filter(feature => featureSet.has(feature));
	}

	const featureConfig = props.editorFeatures === "_ALL_" ?
		{ direct: DEFAULT_DIRECT_FEATURES, menu: DEFAULT_MENU_FEATURES } :
		Array.isArray(props.editorFeatures) ? { direct: props.editorFeatures, menu: [] } : props.editorFeatures;
	const directFeatures = normalizeFeatureOrder(featureConfig.direct);
	const directFeatureSet = new Set(directFeatures);
	const menuFeatures = normalizeFeatureOrder(featureConfig.menu).filter(feature => !directFeatureSet.has(feature));
	const enabledFeatures = new Set([...directFeatures, ...menuFeatures]);

	// Check whether the feature is registered for this editor instance.
	function checkFeatureEnabled(feature: EditorFeature) {
		return enabledFeatures.has(feature);
	}

	const enableBulletList = checkFeatureEnabled("bullet-list");
	const enableOrderedList = checkFeatureEnabled("ordered-list");
	const starterKit = StarterKit.configure({
		bold: checkFeatureEnabled("bold") ? {} : false,
		italic: checkFeatureEnabled("italic") ? {} : false,
		strike: checkFeatureEnabled("strike") ? {} : false,
		code: checkFeatureEnabled("code") ? {} : false,
		codeBlock: checkFeatureEnabled("code-block") ? {} : false,
		blockquote: checkFeatureEnabled("blockquote") ? {} : false,
		hardBreak: {
			keepMarks: true,
			HTMLAttributes: { class: "soft-break" },
		},
		horizontalRule: false,
		heading: checkFeatureEnabled("heading") ? { levels: [...headingLevels] } : false,
		bulletList: enableBulletList ? {} : false,
		orderedList: enableOrderedList ? {} : false,
		listItem: enableBulletList || enableOrderedList ? {} : false,
	});

	// Parse serialized Tiptap JSON while keeping legacy descriptions as plain text.
	function parseInitialContent(content?: JSONContent | string): JSONContent | undefined {
		if (!content) return;
		if (typeof content !== "string") return content;
		try {
			const json = JSON.parse(content) as JSONContent;
			if (json?.type === "doc") return json;
		} catch {}
		return {
			type: "doc",
			content: [{
				type: "paragraph",
				content: [{ type: "text", text: content }],
			}],
		};
	}

	const editor = useEditor({
		extensions: [
			starterKit,
			...checkFeatureEnabled("underline") ? [Underline] : [],
			...checkFeatureEnabled("link") ? [VueComponent.Link] : [],
			...checkFeatureEnabled("text-color") ? [VueComponent.TextColor] : [],
			...checkFeatureEnabled("video-component") ? [VueComponent.ThumbVideo] : [],
			VueComponent.CharacterLimit.configure({ limit: props.maxLength ?? Number.POSITIVE_INFINITY }),
		],
		content: !props.editable ? t("block_and_hide.toasts.cannot_send_comments_because_blocked") : parseInitialContent(props.initialContent),
		autofocus: false,
		editable: props.editable,
		injectCSS: false,
		onUpdate({ editor }) {
			const contentText = editor.getText();
			const contentJson = editor.getJSON();
			updateContentState(editor);
			emits("update", contentJson, contentText);
		},
		onCreate({ editor }) {
			updateContentState(editor);
			const proseMirror = editor.view.dom;
			addEventListeners(proseMirror, "keydown", "keyup", e => stopPropagationExceptKey(e, "F11", "Ctrl + KeyM"));
			proseMirror.addEventListener("input", e => emits("input", e as InputEvent));
			proseMirror.addEventListener("keydown", e => emits("keydown", e));
			proseMirror.addEventListener("keyup", e => emits("keyup", e));
		},
		onBlur() {
			validationRequested.value = true;
		},
	});

	// Update the displayed length and required-field state.
	function updateContentState(editorInstance: Editor) {
		textLength.value = getEditorContentLength(editorInstance.state.doc);
		let hasEmbeddedContent = false;
		editorInstance.state.doc.descendants(node => {
			if (node.type.name === "thumbVideo") hasEmbeddedContent = true;
			return !hasEmbeddedContent;
		});
		hasRequiredContent.value = editorInstance.getText().trim().length > 0 || hasEmbeddedContent;
	}

	const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
	const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
	const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
	const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();
	const clearFormat = () => editor.value?.chain().focus().unsetAllMarks().clearNodes().run();
	const toggleHeading = (level: typeof headingLevels[number]) => editor.value?.chain().focus().toggleHeading({ level }).run();
	const setParagraph = () => editor.value?.chain().focus().setParagraph().run();
	const toggleCode = () => editor.value?.chain().focus().toggleCode().run();
	const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run();
	const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run();
	const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run();
	const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run();

	// Set the selected text color.
	function setTextColor(e: Event) {
		if (!checkFeatureEnabled("text-color")) return;
		const color = (e.target as HTMLInputElement).value;
		editor.value?.chain().focus().setMark("textColor", { color }).run();
	}

	// Normalize a user-entered link and reject unsafe custom protocols.
	function normalizeLink(rawValue: string) {
		const value = rawValue.trim();
		if (!value) return "";
		if (isSafeEditorLink(value)) return value;
		if (/^[a-z][\w+.-]*:/i.test(value)) return;
		const withProtocol = `https://${value}`;
		try {
			new URL(withProtocol);
			return withProtocol;
		} catch {
			return;
		}
	}

	// Open the hyperlink editor at a toolbar or menu item.
	function showLinkEditor(e: MouseEvent) {
		if (!props.editable || !checkFeatureEnabled("link")) return;
		linkUrl.value = String(editor.value?.getAttributes("link").href ?? "");
		linkInvalid.value = false;
		flyoutLink.value = [e, "y"];
	}

	// Apply the entered hyperlink to the current selection.
	function applyLink() {
		const href = normalizeLink(linkUrl.value);
		if (href === undefined) {
			linkInvalid.value = true;
			return;
		}
		if (!href) editor.value?.chain().focus().extendMarkRange("link").unsetMark("link").run();
		else editor.value?.chain().focus().extendMarkRange("link").setMark("link", { href }).run();
		linkInvalid.value = false;
		flyoutLink.value = undefined;
	}

	// Remove a hyperlink from the current selection.
	function removeLink() {
		editor.value?.chain().focus().extendMarkRange("link").unsetMark("link").run();
		linkInvalid.value = false;
		flyoutLink.value = undefined;
	}

	// Insert a video card component at the cursor.
	const addVueComponents = () => editor.value?.chain().focus().insertContent("<thumb-video></thumb-video>").run();
	// Open the compact kaomoji input at the text cursor.
	const showRecentKaomojis = () => checkFeatureEnabled("kaomoji") && (flyoutKaomojiMini.value = [getCursorPixel(), "y"]);
	// Open the mention panel.
	const showAtList = () => {
		if (!checkFeatureEnabled("mention")) return;
		// TODO: 打开提及面板
	};

	// Insert a kaomoji at the current cursor.
	function insertKaomoji(kaomoji?: string) {
		editor.value?.commands.focus();
		if (kaomoji) editor.value?.commands.insertContent(kaomoji);
	}

	// Get the editor cursor rectangle for cursor-anchored flyouts.
	function getCursorPixel() {
		const editorInstance = editor.value;
		if (!editorInstance) return;
		const position = editorInstance.state.selection.$anchor.pos;
		const coordinates = editorInstance.view.coordsAtPos(position);
		return new DOMRect(
			coordinates.left,
			coordinates.top,
			coordinates.right - coordinates.left,
			coordinates.bottom - coordinates.top,
		);
	}

	// Open the shared Menu component with all heading sizes.
	function showHeadingMenu(e: MouseEvent) {
		if (!props.editable || !checkFeatureEnabled("heading")) return;
		menuHeading.value = [e, "y"];
	}

	// Run a configured toolbar or plus-menu feature.
	function runFeature(feature: EditorFeature, e: MouseEvent) {
		if (!props.editable || !checkFeatureEnabled(feature)) return;
		switch (feature) {
			case "bold": toggleBold(); break;
			case "italic": toggleItalic(); break;
			case "underline": toggleUnderline(); break;
			case "link": showLinkEditor(e); break;
			case "strike": toggleStrike(); break;
			case "clear-format": clearFormat(); break;
			case "heading": showHeadingMenu(e); break;
			case "text-color": colorInput.value?.click(); break;
			case "code": toggleCode(); break;
			case "code-block": toggleCodeBlock(); break;
			case "blockquote": toggleBlockquote(); break;
			case "bullet-list": toggleBulletList(); break;
			case "ordered-list": toggleOrderedList(); break;
			case "mention": showAtList(); break;
			case "kaomoji": flyoutKaomoji.value = [e, "y", -3]; break;
			case "video-component": addVueComponents(); break;
			default: break;
		}
	}

	// Resolve the icon used by a toolbar or menu feature.
	function getFeatureIcon(feature: EditorFeature): DeclaredIcons {
		return ({
			bold: "format_bold",
			italic: "format_italic",
			underline: "format_underline",
			link: "link",
			strike: "format_strikethrough",
			"clear-format": "clear_all",
			heading: "font_size",
			"text-color": "palette",
			code: "code",
			"code-block": "code_circle",
			blockquote: "quote_start",
			"bullet-list": "list",
			"ordered-list": "list_numbered",
			mention: "at",
			kaomoji: "kaomoji",
			"video-component": "photo",
		} satisfies Record<EditorFeature, DeclaredIcons>)[feature];
	}

	// Resolve localized text for a toolbar or menu feature.
	function getFeatureTooltip(feature: EditorFeature) {
		return ({
			bold: t("format.bold"),
			italic: t("format.italic"),
			underline: t("format.underline"),
			link: t("format.link"),
			strike: t("format.strikethrough"),
			"clear-format": t("format.clear"),
			heading: t("format.heading"),
			"text-color": t("format.text_color"),
			code: t("format.inline_code"),
			"code-block": t("format.code_block"),
			blockquote: t("format.blockquote"),
			"bullet-list": t("format.bullet_list"),
			"ordered-list": t("format.ordered_list"),
			mention: t("mention"),
			kaomoji: t("kaomoji.title"),
			"video-component": t("format.insert_video"),
		} satisfies Record<EditorFeature, string>)[feature];
	}

	// Resolve active formatting state for direct toolbar highlighting.
	function getFeatureActive(feature: EditorFeature): ActiveType {
		if (feature === "heading") return !!editor.value?.isActive("heading");
		if (feature === "kaomoji") return !!flyoutKaomoji.value;
		const markOrNode = ({
			bold: "bold",
			italic: "italic",
			underline: "underline",
			link: "link",
			strike: "strike",
			"text-color": "textColor",
			code: "code",
			"code-block": "codeBlock",
			blockquote: "blockquote",
			"bullet-list": "bulletList",
			"ordered-list": "orderedList",
		} as Partial<Record<EditorFeature, string>>)[feature];
		return markOrNode ?? false;
	}

	// Clear editor content and reset validation state.
	function clearContent() {
		editor.value?.commands.clearContent();
		textLength.value = 0;
		hasRequiredContent.value = false;
		validationRequested.value = false;
	}

	// Trigger required validation and report whether the editor can be submitted.
	function validate() {
		validationRequested.value = true;
		return !props.required || !isEmpty.value;
	}

	defineExpose({ validate });

	// Submit editor JSON and plain text to the parent component.
	function submit() {
		if (!props.editable || !validate() || props.isSubmitting) return;
		emits("handleSubmit", editor.value?.getJSON() ?? {}, editor.value?.getText() ?? "", clearContent);
	}

	// Resolve an active state accepted by SoftButton.
	function isActive(active?: ActiveType) {
		return typeof active === "boolean" ? active : !!active && editor.value?.isActive(active);
	}

	const ToolItem = (() => {
		const tooltipDirective = resolveDirective("tooltip");
		interface Props {
			tooltip?: string;
			active?: ActiveType;
			disabled?: boolean;
			loading?: boolean;
			icon?: DeclaredIcons;
			onClick?: (e: MouseEvent) => void;
			onMouseenter?: (e: MouseEvent) => void;
		}
		return (props => withDirectives(
			h(SoftButton, {
				active: isActive(props.active),
				disabled: props.disabled,
				loading: props.loading,
				icon: props.icon,
				onClick: props.onClick,
				onMouseenter: props.onMouseenter,
			}),
			tooltipDirective && props.tooltip ? [[tooltipDirective, props.tooltip, "bottom"]] : [],
		)) as VueJsx<Props>;
	})();
</script>

<template>
	<FlyoutKaomoji v-model="flyoutKaomoji" @insert="insertKaomoji" />
	<FlyoutKaomojiMini v-model="flyoutKaomojiMini" @insert="insertKaomoji" @escape="insertKaomoji" />
	<Flyout v-model="flyoutLink" @hide="linkInvalid = false">
		<div class="link-editor">
			<TextBox
				v-model="linkUrl"
				:placeholder="$t('format.link_address')"
				:invalid="linkInvalid ? $t('format.invalid_link') : false"
				icon="link"
				autoFocus
				hideClearAll
				inputMode="url"
				@keydown="e => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } }"
			>
				<template #actions>
					<SoftButton v-if="editor?.isActive('link')" v-tooltip:bottom="$t('format.remove_link')" icon="clear_all" @click="removeLink" />
					<SoftButton v-tooltip:bottom="$t('ok')" icon="check" @click="applyLink" />
				</template>
			</TextBox>
		</div>
	</Flyout>

	<Menu v-model="menuHeading">
		<MenuItem icon="text_format" :class="{ active: editor?.isActive('paragraph') }" @click="setParagraph">
			{{ $t("format.paragraph") }}
		</MenuItem>
		<hr />
		<MenuItem
			v-for="level in headingLevels"
			:key="level"
			icon="font_size"
			:class="{ active: editor?.isActive('heading', { level }) }"
			@click="toggleHeading(level)"
		>
			<span class="heading-menu-label" :class="`level-${level}`">{{ `${$t("format.heading")} ${level}` }}</span>
		</MenuItem>
	</Menu>

	<Menu v-model="menuMore">
		<MenuItem v-for="feature in menuFeatures" :key="feature" :icon="getFeatureIcon(feature)" @click="e => runFeature(feature, e)">
			{{ getFeatureTooltip(feature) }}
		</MenuItem>
	</Menu>

	<Comp
		ref="rtfEditor"
		:class="{ invalid: isInvalid }"
		:style="{ '--editor-max-height': maxContentHeight ? `${maxContentHeight}px` : undefined }"
		:aria-invalid="isInvalid"
		:aria-required="required"
		@keyup.stop.ctrl.m="showRecentKaomojis"
	>
		<ClientOnly>
			<EditorContent class="editor-content" :editor />
		</ClientOnly>
		<input v-if="checkFeatureEnabled('text-color')" ref="colorInput" class="color-input" type="color" @input="setTextColor" />
		<div class="toolbar">
			<div class="left">
				<ToolItem
					v-for="feature in directFeatures"
					:key="feature"
					:tooltip="getFeatureTooltip(feature)"
					:icon="getFeatureIcon(feature)"
					:active="getFeatureActive(feature)"
					:disabled="!props.editable"
					@click="e => runFeature(feature, e)"
					@mouseenter="e => { if (feature === 'heading') showHeadingMenu(e); }"
				/>
				<ToolItem
					v-if="menuFeatures.length > 0"
					:tooltip="$t('more')"
					icon="add"
					:active="!!menuMore"
					:disabled="!props.editable"
					@click="e => menuMore = [e, 'y']"
				/>
			</div>
			<div class="right">
				<span class="text-length" :class="{ limit: isLengthLimitReached }">
					{{ maxLength === undefined ? textLength : `${textLength} / ${maxLength}` }}
				</span>
				<ToolItem
					v-if="submittable"
					:tooltip="$t('send')"
					icon="send"
					:disabled="isEmpty || isSubmitting || !props.editable"
					:loading="isSubmitting"
					@click="submit"
				/>
			</div>
		</div>
	</Comp>
</template>

<style scoped lang="scss">
	:comp {
		@include round-large;
		@include control-inner-shadow;
		position: relative;
		min-width: 0;
		max-width: 100%;
		overflow: clip;
		background-color: c(inset-bg);

		&.invalid {
			outline: 2px solid c(red);
		}

		.editor-content {
			display: block;
			max-width: 100%;
			max-height: var(--editor-max-height, none);
			overflow: auto;

			:deep(.tiptap) {
				min-width: 0;
				max-width: 100%;
				min-height: 3em;
				padding: 12px;
				overflow-wrap: anywhere;
			}

			// Enter has the normal line height. Shift+Enter uses a tighter hard break.
			:deep(br.soft-break) {
				content: "";
				display: block;
				margin-top: -0.22em;
			}

			:deep(code) {
				padding: 0 0.3em;
				color: c(text-color);
				font-size: 0.9em;
				line-height: 1.2;
				background-color: c(main-fg, 10%);
				border-radius: 3px;
				box-shadow: 0 0 0 1px c(main-fg, 18%) inset;
				box-decoration-break: clone;
			}

			:deep(pre) {
				@include round-small;
				margin-block: 0.75em;
				padding: 12px 14px;
				overflow: auto;
				color: c(text-color);
				background-color: c(main-fg, 8%);
				border: 1px solid c(main-fg, 18%);
				white-space: pre-wrap;
				overflow-wrap: normal;
				word-break: normal;
				tab-size: 4;

				code {
					padding: 0;
					font-size: inherit;
					line-height: inherit;
					background: none;
					border: 0;
					border-radius: 0;
					box-shadow: none;
					white-space: inherit;
				}
			}

			:deep(blockquote) {
				margin-inline: 0;
				padding-inline-start: 12px;
				border-inline-start: 3px solid c(icon-color, 40%);
			}

			:deep(ul),
			:deep(ol) {
				padding-inline-start: 24px;
			}
		}

		.color-input {
			position: absolute;
			width: 0;
			height: 0;
			opacity: 0;
			pointer-events: none;
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

					&.limit {
						color: c(red);
					}
				}
			}
		}
	}

	.link-editor {
		width: min(360px, calc(100dvw - 32px));
	}

	:deep(.menu-item.active) {
		color: c(accent);
		background-color: c(accent, 10%);
	}

	.heading-menu-label {
		display: block;
		min-width: 8em;

		@for $level from 1 through 6 {
			&.level-#{$level} {
				font-size: #{1.45 - ($level - 1) * 0.1}em;
			}
		}
	}
</style>
