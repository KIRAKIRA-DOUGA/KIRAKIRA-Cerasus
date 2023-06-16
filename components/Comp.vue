<script lang="tsx">
	type Role = "alert" | "alertdialog" | "button" | "checkbox" | "dialog" | "gridcell" | "link" | "log" | "marquee" | "menuitem" | "menuitemcheckbox" | "menuitemradio" | "option" | "progressbar" | "radio" | "scrollbar" | "searchbox" | "slider" | "spinbutton" | "status" | "switch" | "tab" | "tabpanel" | "textbox" | "timer" | "tooltip" | "treeitem" | "combobox" | "grid" | "listbox" | "menu" | "menubar" | "radiogroup" | "tablist" | "tree" | "treegrid" | "application" | "article" | "cell" | "columnheader" | "definition" | "directory" | "document" | "feed" | "figure" | "group" | "heading" | "img" | "list" | "listitem" | "math" | "none" | "note" | "presentation" | "region" | "row" | "rowgroup" | "rowheader" | "separator" | "table" | "term" | "text" | "toolbar" | "banner" | "complementary" | "contentinfo" | "form" | "main" | "navigation" | "search" | "doc-abstract" | "doc-acknowledgments" | "doc-afterword" | "doc-appendix" | "doc-backlink" | "doc-biblioentry" | "doc-bibliography" | "doc-biblioref" | "doc-chapter" | "doc-colophon" | "doc-conclusion" | "doc-cover" | "doc-credit" | "doc-credits" | "doc-dedication" | "doc-endnote" | "doc-endnotes" | "doc-epigraph" | "doc-epilogue" | "doc-errata" | "doc-example" | "doc-footnote" | "doc-foreword" | "doc-glossary" | "doc-glossref" | "doc-index" | "doc-introduction" | "doc-noteref" | "doc-notice" | "doc-pagebreak" | "doc-pagelist" | "doc-part" | "doc-preface" | "doc-prologue" | "doc-pullquote" | "doc-qna" | "doc-subtitle" | "doc-tip" | "doc-toc";
	// 不包含: "meter" | "rating"

	const comp = defineComponent({
		props: {
			/**
			 * 指示其元素是否可以聚焦，以及它是否/在何处参与顺序键盘导航。
			 *
			 * 因为标签透传功能似乎不支持该标签，因此手动添加一个属性来实现。
			 */
			tabindex: {
				type: [Number, String] as PropType<Numberish>,
				default: undefined,
			},
			/**
			 * 使用 `role` 可以增强组件的可读性和语义化。值得注意的是这个属性是枚举而并非任意填写的。
			 */
			role: {
				type: String as PropType<Role>,
				default: "application",
			},
		},
		setup() {
			const instance = getCurrentInstance();
			let className = "";
			do {
				if (!instance) break;
				const parent = useParentByScopeId();
				let componentName = parent?.type.__name;
				if (!componentName) {
					// 注意该块内容无法在生产环境下运行。暂时没有更好的解决方法，有待优化。
					const componentPath = parent?.type.__file;
					if (!componentPath) break;
					componentName = filenameWithoutExtension(componentPath);
				}
				if (!componentName) break;
				className = new VariableName(componentName).kebab;
			} while (false);
			const label = new VariableName(className).words;
			return { className, label };
		},
		render() {
			return (
				<kira-component tabindex={this.tabindex} class={this.className} role={this.role} aria-label={this.label}>
					{this.$slots.default?.()}
				</kira-component>
			);
		},
	});

	type OnToAt<T> = T extends `on${infer U}` ? `@${Lowercase<U>}` : never;
	type OnEvents = { [event in keyof Events as OnToAt<event>]?: (payload: Events[event]) => void; };
	export default comp as typeof comp & JSX.IntrinsicElements["section"] & OnEvents;
</script>
