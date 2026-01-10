import { useDrag } from "@vueuse/gesture";
import type Danmaku from "danmaku";
import * as themeTypes from "modules/theme/types";
import { AcceptedPlugin } from "postcss";
import "temporal-polyfill/global";

export namespace FlyoutModelNS {
	export type Target = MaybeRef<MouseEvent | PointerEvent | TwoD | HTMLElement | EventTarget | DOMRect | undefined | null>;
	export type Tuple = [target: Target, placement?: Placement, offset?: number];
	export type Object = { target: Target; placement?: Placement; offset?: number };
}

namespace AnimatedIconStateNS {
	export type Tuple = [marker?: string, loop?: boolean, speed?: number];
	export type Object = { marker?: string; loop?: boolean; speed?: number };
}

type DanmakuMode = NonNull<DanmakuComment["mode"]>;

/**
 * 在此处声明各组件或函数等希望全局使用的类型名称，其名称应尽可能复杂以规避重名。有必要时可使用命名空间。
 */
declare global {
	/** TAB 按键的移动方向。 */
	type Movement = "previous" | "next";
	/** 复选框选中状态。 */
	type CheckState = "unchecked" | "indeterminate" | "checked";
	/** 遮罩的插槽位置方向。 */
	type MaskSlotPosition = "left top" | "center top" | "right top" | "left center" | "center" | "right center" | "left bottom" | "center bottom" | "right bottom";
	/** 标志文本形态。 */
	type LogoTextFormType = "hidden" | "half" | "full";
	/** 隐私公开性。 */
	type PrivacyType = "public" | "following" | "private";
	/** 工具提示、浮窗等的放置位置方向。 */
	type Placement = "top" | "right" | "bottom" | "left" | "x" | "y";
	/** 版权。 */
	type Copyright = "original" | "authorized-repost" | "repost";
	/** 视图。 */
	type ViewType = "list" | "grid" | "tile";
	/** 排序顺序，升序或降序。 */
	type SortOrder = "ascending" | "descending";
	/** 主题。 */
	type ThemeType = themeTypes.ThemeType;
	/** 主题，包括跟随系统。 */
	type ThemeSetType = themeTypes.ThemeSetType;
	/** 个性色。 */
	type PaletteType = themeTypes.PaletteType;
	/** 选项卡指示器的移动方向。 */
	type TabBarMovement = Movement | "ignore" | "none" | "fade";
	/** 可作为 URL Search Params 的更宽松类型。 */
	type UrlQueryType = string | URLSearchParams | Record<string, Readable>;
	/** 发射弹幕信息。 */
	type DanmakuComment = Parameters<Danmaku["emit"]>[0];
	/** 弹幕列表项目。 */
	interface DanmakuListItem {
		videoTime: Duration;
		content: string;
		sendTime: Date;
	}
	/** 颜色模型。 */
	type ColorModel = "rgb" | "hsl" | "hsb";
	/** 弹幕格式。 */
	interface DanmakuFormat {
		fontSize: "small" | "medium" | "large";
		color: Color;
		mode: DanmakuMode;
		enableRainbow: boolean;
	}
	/** 手势拖动事件。 */
	type GestureDragEvent = Parameters<Parameters<typeof useDrag<PointerEvent>>[0]>[0];
	/** 视频播放器设置。 */
	type PlayerVideoSettings = {
		autoplay: boolean;
		danmaku: {
			fontSizeScale: number;
			opacity: number;
		};
		controller: {
			showStop: boolean;
			showReplay: boolean;
			showFrameByFrame: boolean;
			autoResumePlayAfterSeeking: boolean;
		};
		filter: {
			hFlip: boolean;
			vFlip: boolean;
			rotation: 0 | 90 | 180 | 270;
			mirror: "left" | "right" | "top" | "bottom" | false;
			grayscale: boolean;
			invert: boolean;
			sepia: boolean;
			hue: number;
			saturate: number;
			contrast: number;
			brightness: number;
		};
	};
	/** 媒体缓冲加载进度数组。 */
	type Buffered = [start: number, end: number][];
	/** 基础日期时间选择器字段。 */
	interface BaseDateTimePickerField<TValue extends Readable = Readable, TDisplay extends Readable = Readable> {
		/** 字段组名。如：year、month、date。 */
		name: string;
		/** 该字段所用可用的值。建议使用与语言无关或方便计算的数据。 */
		values: readonly TValue[] | (() => readonly TValue[]);
		/** 该字段与下一个字段之间的分隔符，如果没有则显示为空白。 */
		sep?: string;
		/** 该字段内数据是否允许循环滚动？默认为否。 */
		loopable?: boolean;
		/** 设置字段的最小宽度（CSS 值）。 */
		minWidth?: string | (() => string | undefined);
		/** 从 `values` 内数据值转换到本地化显示文本值的函数，如果未提供则直接显示 `values` 内的数据值。 */
		getDisplayValue?(value: TValue): TDisplay;
		/** 当值为 undefined 时显示的占位符长度。默认为 2。 */
		placeholderLength?: number;
	}
	/** 基础日期时间选择器只读纯文本字段。 */
	interface BaseDateTimePickerFieldPlain {
		/** 字段组名。如：year、month、date。 */
		name: string;
		/** 要显示的只读文本。 */
		text: Readable | (() => Readable);
		/** 该字段与下一个字段之间的分隔符，如果没有则显示为空白。 */
		sep?: string;
		/** 设置字段的最小宽度（CSS 值）。 */
		minWidth?: string | (() => string);
		/** 当值为 undefined 时显示的占位符长度。默认为 2。 */
		placeholderLength?: number;
	}

	type FlyoutModel = FlyoutModelNS.Tuple | FlyoutModelNS.Object;
	type MenuModel = MouseEvent | PointerEvent | null;
	type AnimatedIconState = AnimatedIconStateNS.Tuple | AnimatedIconStateNS.Object;
	type SortModel = [id: string, order: SortOrder];

	/** PostCSS 插件。 */
	type PostCSSPlugin = { postcss: true } & ((opts?: AnyObject) => AcceptedPlugin);

	/**
	 * 使用 `role` 可以增强组件的可读性和语义化。值得注意的是这个属性是枚举而并非任意填写的。
	 * @remarks 不包含: "meter" | "rating"
	 */
	type Role = "alert" | "alertdialog" | "button" | "checkbox" | "dialog" | "gridcell" | "link" | "log" | "marquee" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "progressbar" | "radio" | "scrollbar" | "searchbox" | "slider" | "spinbutton" | "status" | "switch" | "tab" | "tabpanel" | "textbox" | "timer" | "tooltip" | "treeitem" | "combobox" | "grid" | "listbox" | "menu" | "menubar" | "radiogroup" | "tablist" | "tree" | "treegrid" | "application" | "article" | "cell" | "columnheader" | "definition" | "directory" | "document" | "feed" | "figure" | "group" | "heading" | "img" | "list" | "listitem" | "math" | "none" | "note" | "presentation" | "region" | "row" | "rowgroup" | "rowheader" | "separator" | "table" | "term" | "text" | "toolbar" | "banner" | "complementary" | "contentinfo" | "form" | "main" | "navigation" | "search" | "doc-abstract" | "doc-acknowledgments" | "doc-afterword" | "doc-appendix" | "doc-backlink" | "doc-biblioentry" | "doc-bibliography" | "doc-biblioref" | "doc-chapter" | "doc-colophon" | "doc-conclusion" | "doc-cover" | "doc-credit" | "doc-credits" | "doc-dedication" | "doc-endnote" | "doc-endnotes" | "doc-epigraph" | "doc-epilogue" | "doc-errata" | "doc-example" | "doc-footnote" | "doc-foreword" | "doc-glossary" | "doc-glossref" | "doc-index" | "doc-introduction" | "doc-noteref" | "doc-notice" | "doc-pagebreak" | "doc-pagelist" | "doc-part" | "doc-preface" | "doc-prologue" | "doc-pullquote" | "doc-qna" | "doc-subtitle" | "doc-tip" | "doc-toc";
}
