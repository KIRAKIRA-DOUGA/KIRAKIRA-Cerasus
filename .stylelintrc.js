module.exports = {
	defaultSeverity: "error",
	extends: [
		"stylelint-config-standard",
		"stylelint-config-standard-scss",
		"stylelint-config-rational-order",
	],
	overrides: [ // 扫描.vue/html文件中的<style>标签内的样式
		{
			files: ["**/*.{vue,html}"],
			customSyntax: "postcss-html"
		}
	],
	plugins: [
		"stylelint-scss",
		"stylelint-order",
		"stylelint-config-rational-order/plugin",
	],
	rules: {
		"media-feature-name-no-vendor-prefix": true, // 不要使用已被 autoprefixer 支持的浏览器前缀。
		"at-rule-no-vendor-prefix": true,
		"selector-no-vendor-prefix": true,
		"property-no-vendor-prefix": true,
		"value-no-vendor-prefix": true,
		"color-hex-case": "lower", // 颜色值要小写。
		"color-hex-length": "short", // 颜色值能短则短。
		"indentation": "tab",
		"length-zero-no-unit": true,
		// "selector-class-pattern": /^[A-Za-z0-9]+$/, // 换回连字符了。
		"value-keyword-case": null, // 与 v-bind 冲突了。
		"value-list-comma-newline-after": null,
		"max-line-length": null,
		"no-eol-whitespace": [true, { ignore: ["empty-lines"] }],
		"no-descending-specificity": null,
		"function-url-quotes": "always",
		"string-quotes": "double",
		"block-opening-brace-space-before": "always",
		"import-notation": null,
		"at-rule-no-unknown": null,
		"function-no-unknown": null,
		"declaration-empty-line-before": null,
		"custom-property-empty-line-before": null,
		"selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["deep", "global", "export"] }],
		"declaration-block-no-duplicate-properties": true,
		"declaration-block-no-duplicate-custom-properties": true,
		"font-family-no-duplicate-names": true,
		"keyframe-block-no-duplicate-selectors": true,
		"custom-property-no-missing-var-function": true,
		"keyframe-declaration-no-important": true,
		"font-family-no-missing-generic-family-keyword": true,
		"font-family-name-quotes": "always-where-recommended",
		"comment-empty-line-before": ["always", {
			except: ["first-nested"],
			ignore: ["stylelint-commands"],
			severity: "warning",
		}],
		"scss/dollar-variable-empty-line-before": null,
		"scss/double-slash-comment-empty-line-before": ["always", {
			except: ["first-nested"],
			ignore: ["between-comments", "stylelint-commands"],
			severity: "warning",
		}],
		"scss/dollar-variable-first-in-block": [true, {
			ignore: ["comments", "imports"],
			except: ["root", "function"],
		}],
		"order/properties-order": [[], { severity: "warning" }],
	},
};
