module.exports = {
	defaultSeverity: "error",
	extends: [
		"stylelint-config-standard",
		"stylelint-config-standard-scss",
	],
	overrides: [ // 扫描.vue/html文件中的<style>标签内的样式
		{
			files: ["**/*.{vue,html}"],
			customSyntax: "postcss-html"
		}
	],
	plugins: ["stylelint-scss"],
	rules: {
		"media-feature-name-no-vendor-prefix": true, // 不要使用已被 autoprefixer 支持的浏览器前缀
		"at-rule-no-vendor-prefix": true,
		"selector-no-vendor-prefix": true,
		"property-no-vendor-prefix": true,
		"value-no-vendor-prefix": true,
		"color-hex-case": "lower", // 颜色值要小写
		"color-hex-length": "short", // 颜色值能短则短
		"indentation": "tab",
		"length-zero-no-unit": true,
		"selector-class-pattern": /^[A-Za-z0-9]+$/,
		"value-keyword-case": null, // 与v-bind冲突了
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
		"scss/dollar-variable-empty-line-before": null,
	},
};
