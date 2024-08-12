import parser from "postcss-selector-parser";

const latinLangs = ["en", "vi", "id", "fr"] as const;

// 值得注意的是，:lang 选择器并不支持同时选择多种语言，即你不能这么写：
// :lang(zh, en, ja)
// 你必须只能这么写：
// :is(:lang(zh), :lang(en), :lang(ja))

const transformPseudo: parser.SyncProcessor = selectors => {
	selectors.walk(selector => {
		if (selector.type === "pseudo" && selector.value.match(/:lang-latin$/)) {
			const newSelectorValue = `:is(${latinLangs.map(lang => `:lang(${lang})`).join(", ")})`;
			const newSelector = parser.pseudo({ value: newSelectorValue });
			selector.replaceWith(newSelector);
		}
	});
};

const componentRoot: PostCSSPlugin = (_opts = {}) => {
	return {
		postcssPlugin: "postcss-component-root",
		Rule(rule, _helper) {
			if (rule.selector.match(/:lang-latin(?![-_\w])/))
				rule.selector = parser(transformPseudo).processSync(rule.selector);
		},
	};
};
componentRoot.postcss = true;

export default componentRoot;
