/*
 * 该 PostCSS 插件代码参考自：https://github.com/saulhardman/postcss-hover-media-feature
 */

import { AtRule, Helpers, Rule } from "postcss";

const ANY_HOVER_REGEXP = /:any-hover(?![-_\w])/g;

const anyHover: PostCSSPlugin = () => {
	const createMediaQuery = (rule: Rule, { AtRule }: Pick<Helpers, "AtRule">) => {
		const media = new AtRule({ name: "media", params: "(any-hover: hover)" });
		media.source = rule.source;
		media.append(rule);
		return media;
	};

	const isAlreadyNested = (rule: Rule) => {
		let container = rule.parent!;
		while (container !== null && container.type !== "root") {
			if (container.type === "atrule") {
				const atRule = container as AtRule;
				if (atRule.params.includes("hover: hover") || atRule.params.includes("any-hover: hover"))
					return true;
			}
			container = container.parent as typeof container;
		}
		return false;
	};

	const restoreAnyHoverPseudo = (selector: string) => selector.replaceAll(ANY_HOVER_REGEXP, ":hover");

	return {
		postcssPlugin: "postcss-any-hover",

		Rule(rule, { AtRule }) {
			if (!rule.selector.match(ANY_HOVER_REGEXP)) return;

			if (isAlreadyNested(rule)) {
				rule.selector = restoreAnyHoverPseudo(rule.selector);
				return;
			}

			const hoverSelectors: string[] = [], nonHoverSelectors: string[] = [];

			rule.selectors.forEach(selector => {
				if (selector.match(ANY_HOVER_REGEXP))
					hoverSelectors.push(restoreAnyHoverPseudo(selector));
				else
					nonHoverSelectors.push(selector);
			});

			if (hoverSelectors.length === 0) return;

			const clonedRule = (selectors: string[] = hoverSelectors) => rule.clone({ selectors });

			let existAnyHoverAtRule: AtRule | undefined;
			/* rule.root().walkAtRules("media", atRule => {
				if (atRule.params.includes("any-hover: hover") && !existAnyHoverAtRule)
					existAnyHoverAtRule = atRule;
			}); */
			// 如果下次有想法来研究如何节省 CSS 文件大小的话可以再开启本段代码。
			// 目前问题是不能检测外部是否有嵌套其它 At Rule。

			if (!existAnyHoverAtRule) {
				const mediaQuery = createMediaQuery(clonedRule(), { AtRule });
				rule.after(mediaQuery);
			} else
				existAnyHoverAtRule.append(clonedRule());

			if (nonHoverSelectors.length > 0) {
				rule.replaceWith(clonedRule(nonHoverSelectors));
				return;
			}

			rule.remove();
		},
	};
};

anyHover.postcss = true;

export default anyHover;
