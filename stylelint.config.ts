import type { Config } from "stylelint";
import { defineStylistic, type RulesInput } from "@stylistic/stylelint-plugin";
import propertiesOrder from "./stylelint-properties-order.ts";

const stylisticRules = {
	"color-hex-case": "lower", // 颜色值要小写。
	"indentation": ["tab", { baseIndentLevel: "auto" }],
	"value-list-comma-newline-after": null,
	"max-line-length": null,
	"no-eol-whitespace": [true, { "ignore": ["empty-lines"] }],
	"string-quotes": "double",
	"block-opening-brace-space-before": "always",
	"block-closing-brace-empty-line-before": "never",
	"number-leading-zero": "always",
	"unit-case": "lower",
	"declaration-block-trailing-semicolon": "always",
	"declaration-block-semicolon-space-after": "always-single-line",
	"declaration-block-semicolon-space-before": "never",
	"declaration-colon-space-after": "always-single-line",
	"declaration-colon-space-before": "never",
	"function-comma-space-after": "always-single-line",
	"function-comma-space-before": "never",
	"function-parentheses-space-inside": "never-single-line",
	"media-feature-colon-space-after": "always",
	"media-feature-colon-space-before": "never",
	"media-feature-parentheses-space-inside": "never",
	"media-feature-range-operator-space-after": "always",
	"media-feature-range-operator-space-before": "always",
	"media-query-list-comma-space-after": "always-single-line",
	"media-query-list-comma-space-before": "never",
	"selector-attribute-brackets-space-inside": "never",
	"selector-attribute-operator-space-after": "never",
	"selector-attribute-operator-space-before": "never",
	"selector-combinator-space-after": "always",
	"selector-combinator-space-before": "always",
	"selector-list-comma-newline-after": "always",
	"selector-list-comma-newline-before": "never-multi-line",
	"selector-list-comma-space-after": "always-single-line",
	"selector-list-comma-space-before": "never",
	"selector-pseudo-class-parentheses-space-inside": "never",
	"value-list-comma-space-after": "always-single-line",
	"value-list-comma-space-before": "never",
} satisfies RulesInput;

export default {
	defaultSeverity: "error",
	extends: [
		"stylelint-config-standard",
		"stylelint-config-standard-scss",
	],
	overrides: [ // 扫描 .vue/html 文件中的 <style> 标签内的样式
		{
			files: ["**/*.{vue,html}"],
			customSyntax: "postcss-html",
		},
		{
			files: ["assets/styles/global.scss"],
			rules: {
				"selector-no-deprecated": [true, { ignoreSelectors: ["tt", "xmp"] }], // 保留旧版 HTML 元素的等宽样式。
			},
		},
	],
	plugins: [
		"stylelint-scss",
		"stylelint-order",
		"@stylistic/stylelint-plugin",
	],
	languageOptions: {
		syntax: {
			properties: {
				"container-type": "| anchored",
			},
			types: {},
		},
	},
	rules: {
		...defineStylistic({ rules: stylisticRules }),
		...defineStylistic({ syntax: "scss", rules: stylisticRules }),
		"media-feature-name-no-vendor-prefix": true, // 不要使用已被 autoprefixer 支持的浏览器前缀。
		"at-rule-no-vendor-prefix": true,
		"selector-no-vendor-prefix": true,
		"property-no-vendor-prefix": true,
		"value-no-vendor-prefix": true,
		"color-hex-length": "short", // 颜色值能短则短。
		"color-named": "always-where-possible", // 颜色若有名字则必须写为其名字。
		"function-disallowed-list": [/^rgb/, /^hsl/, /^hwb/], // 只允许用 16 进制表示颜色，不允许使用 rgb、rgba 等表示颜色。
		"length-zero-no-unit": true,
		// "selector-class-pattern": /^[A-Za-z0-9]+$/, // 换回连字符了。
		"value-keyword-case": null, // 与 v-bind 冲突了。
		"no-descending-specificity": null,
		"function-url-quotes": "always",
		"import-notation": null,
		"at-rule-no-unknown": null,
		"function-no-unknown": null,
		"property-no-unknown": [true, { "severity": "warning" }],
		"declaration-property-value-no-unknown": [true, {
			"severity": "warning",
			"ignoreProperties": {
				"/.+/": ["/[\\w-]+\\(/", "/\\$[\\w-]+/"],
			},
		}],
		"declaration-empty-line-before": null,
		"custom-property-empty-line-before": null,
		"selector-pseudo-class-no-unknown": [true, {
			"ignorePseudoClasses": ["deep", "slotted", "global", "export", "vertical", "horizontal", "decrement", "increment", "component", "comp", "any-hover", "lang-latin", "lang-justify"],
		}],
		"declaration-block-no-duplicate-properties": true,
		"declaration-block-no-duplicate-custom-properties": true,
		"font-family-no-duplicate-names": true,
		"keyframe-block-no-duplicate-selectors": true,
		"custom-property-no-missing-var-function": true,
		"keyframe-declaration-no-important": true,
		"font-family-no-missing-generic-family-keyword": true,
		"font-family-name-quotes": "always-where-recommended",
		"comment-empty-line-before": null,
		"function-calc-no-unspaced-operator": null, // 暂时解决一打 calc() 还没打完内容右下角就开始疯狂报错的问题。
		/* "comment-empty-line-before": ["always", {
			"except": ["first-nested"],
			"ignore": ["stylelint-commands"],
			"severity": "warning",
		}], */
		"at-rule-empty-line-before": ["always", {
			"except": ["first-nested"],
			"ignore": ["after-comment"],
			"ignoreAtRules": ["import", "include", "else", "return", "forward", "use", "debug", "extend"],
		}],
		"unit-disallowed-list": [
			"vw", "vh", "vmin", "vmax", // 请使用 dvw、dvh、dvmin、dvmax 代替之。
			"cm", "mm", "Q", "in", "pc", "pt", "mozmm", // 你觉得这种单位可能合理吗？
		],
		"declaration-property-value-disallowed-list": {
			"/^(justify|align)-(content|items|self)$/": ["flex-start", "flex-end"], // flex-start、flex-end 与 start、end 没有任何区别，不要使用它们。
		},
		"rule-empty-line-before": null,
		"no-invalid-double-slash-comments": null,
		"number-max-precision": null,
		"scss/dollar-variable-empty-line-before": null,
		"scss/double-slash-comment-empty-line-before": null,
		/* "scss/double-slash-comment-empty-line-before": ["always", {
			"except": ["first-nested"],
			"ignore": ["between-comments", "stylelint-commands"],
			"severity": "warning",
		}], */
		"scss/at-extend-no-missing-placeholder": null, // 可继承一般的类名。
		/* "scss/dollar-variable-first-in-block": [true, {
			"ignore": ["comments", "imports"],
			"except": ["root", "function"],
		}], */
		"order/order": [
			{
				"type": "at-rule",
				"name": "include",
				"hasBlock": false,
			},
			"dollar-variables",
			"custom-properties",
			"declarations",
			// "at-rules", // <-- important, `@media` should go before `&:pseudo`
			"rules",
		],
		"order/properties-order": [propertiesOrder, { "unspecified": "bottom", "severity": "warning" }],
	},
} satisfies Config;
