import selectorParser from "postcss-selector-parser";
import { Rule, Helpers, AtRule } from "postcss";

const selectorProcessor = selectorParser(selectors => {
	const hoverSelectors: string[] = [];

	selectors.walk(selector => {
		if (
			selector.type === "pseudo" &&
			selector.toString() === ":any-hover" &&
			selector.parent!.value !== ":not" &&
			selector.parent!.toString() !== ":any-hover"
		)
			hoverSelectors.push(selector.parent!.toString());
	});

	const nonHoverSelectors = selectors.reduce((acc, selector) => {
		if (hoverSelectors.includes(selector.toString()))
			return acc;
		return [...acc, selector.toString()];
	}, [] as string[]);

	return { hoverSelectors, nonHoverSelectors };
});

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

	return {
		postcssPlugin: "postcss-any-hover",

		Rule(rule, { AtRule }) {
			if (
				!rule.selector.includes(":any-hover") ||
				isAlreadyNested(rule)
			)
				return;

			const {
				hoverSelectors = [],
				nonHoverSelectors = [],
			} = selectorProcessor.transformSync(rule.selector, { lossless: false });

			if (hoverSelectors.length === 0)
				return;
			
			for (let i = 0; i < hoverSelectors.length; i++)
				hoverSelectors[i] = hoverSelectors[i].replaceAll(":any-hover", ":hover");
			
			const mediaQuery = createMediaQuery(
				rule.clone({ selectors: hoverSelectors }),
				{ AtRule },
			);

			rule.after(mediaQuery);

			if (nonHoverSelectors.length > 0) {
				rule.replaceWith(rule.clone({ selectors: nonHoverSelectors }));
				return;
			}

			rule.remove();
		},
	};
};

anyHover.postcss = true;

export default anyHover;
