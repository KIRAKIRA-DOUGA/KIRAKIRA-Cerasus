// env
import globals from "globals";
// extends
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import pluginVue from "eslint-plugin-vue";
import jsdoc from "eslint-plugin-jsdoc";
// plugins
import unicorn from "eslint-plugin-unicorn";

/** @type {import("eslint").Linter.Config[]} */
export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/essential"],
	importPlugin.flatConfigs.warnings,
	jsdoc.configs["flat/recommended-typescript"],
	stylistic.configs.customize({
		indent: "tab",
		quotes: "double",
		semi: true,
	}),
	{
		/* extends: [
			"@nuxtjs/eslint-config-typescript",
			"plugin:nuxt/recommended",
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended",
			"plugin:vue/vue3-essential",
		], */
		// ↑ Legacy ESLint configuration backup
		plugins: {
			"typescript-eslint": tseslint.plugin,
			unicorn,
		},
		languageOptions: {
			parserOptions: {
				parser: {
					ts: tseslint.parser,
				},
				project: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".vue"],
			},
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		files: ["**/*.{js,jsx,ts,tsx,vue}"],
		settings: {
			react: {
				version: "detect",
			},
			jsdoc: {
				tagNamePreference: {
					arg: "param",
					return: "returns",
					typeParam: "template",
					params: "param",
					remark: "remarks",
					notes: "note",
					warning: "warn",
				},
			},
		},
		rules: {
			"@stylistic/indent": ["error", "tab", {
				"SwitchCase": 1,
				"flatTernaryExpressions": true,
				"ignoredNodes": [
					"Program > .body",
					"TSFunctionType *", // stylistic typescript indent bug
					"TSMappedType *", // stylistic typescript indent bug
				],
				"ignoreComments": true,
			}],
			"@stylistic/linebreak-style": ["error", "unix"],
			"@stylistic/quotes": ["error", "double", { "avoidEscape": true }],
			"@stylistic/semi": ["error", "always"],
			"@stylistic/array-bracket-spacing": ["error", "never"],
			"@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
			"@stylistic/comma-dangle": ["error", "always-multiline"],
			"@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
			"@stylistic/comma-style": ["error", "last"],
			"@stylistic/eol-last": "error",
			"default-case": "error",
			"no-duplicate-case": "error",
			"no-eq-null": "off",
			"@stylistic/no-floating-decimal": "error",
			"@stylistic/no-mixed-spaces-and-tabs": ["error", false],
			"no-var": "error",
			"no-unused-vars": "off",
			"@stylistic/no-tabs": "off",
			"no-empty": ["error", { "allowEmptyCatch": true }],
			"no-constant-condition": ["error", { "checkLoops": false }],
			"eqeqeq": ["error", "always", { "null": "ignore" }],
			"prefer-const": ["error", { "destructuring": "all" }],
			"for-direction": "error",
			"getter-return": "error",
			"no-compare-neg-zero": "error",
			"no-cond-assign": ["error", "except-parens"],
			"@stylistic/no-extra-semi": "error",
			"no-irregular-whitespace": "error",
			"no-unreachable": "warn",
			"use-isnan": ["error", { "enforceForSwitchCase": true, "enforceForIndexOf": true }],
			"valid-typeof": "error",
			"curly": ["error", "multi"],
			"no-lonely-if": "off",
			"dot-notation": ["error"],
			"guard-for-in": "error",
			"no-extra-label": "off",
			"require-await": "error",
			"yoda": "error",
			"@stylistic/block-spacing": "error",
			"@stylistic/function-call-spacing": ["error", "never"],
			"@stylistic/computed-property-spacing": ["error", "never"],
			"@stylistic/no-whitespace-before-property": "error",
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/padded-blocks": ["error", "never"],
			"@stylistic/quote-props": ["error", "as-needed"],
			"@stylistic/semi-spacing": "error",
			"@stylistic/semi-style": ["error", "last"],
			"@stylistic/space-before-function-paren": ["error", {
				"anonymous": "always",
				"named": "never",
				"asyncArrow": "always",
			}],
			"@stylistic/space-infix-ops": "error",
			"@stylistic/space-in-parens": ["error", "never"],
			"@stylistic/space-unary-ops": "error",
			"unicode-bom": ["error", "never"],
			"@stylistic/arrow-spacing": "error",
			"require-yield": "error",
			"@stylistic/yield-star-spacing": ["error", "after"],
			"symbol-description": "error",
			"@stylistic/template-tag-spacing": "error",
			"@stylistic/switch-colon-spacing": "error",
			"@stylistic/keyword-spacing": "error",
			"@stylistic/key-spacing": "error",
			"@stylistic/jsx-quotes": "error",
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/dot-location": ["error", "property"],
			"no-loss-of-precision": "error",
			"no-useless-concat": "error",
			"object-shorthand": "error",
			"prefer-template": "off",
			"@stylistic/template-curly-spacing": "error",
			"no-undef": "off", // 这波 nuxt 的锅。
			"@stylistic/multiline-ternary": "off",
			"@stylistic/operator-linebreak": ["error", "after"],
			"@stylistic/no-trailing-spaces": ["error", { "skipBlankLines": true }],
			"one-var": "off",
			"@stylistic/arrow-parens": ["error", "as-needed"],
			"camelcase": "off",
			"@stylistic/spaced-comment": ["error", "always", {
				"exceptions": ["+", "-", "*", "/"],
				"markers": ["/", "!", "@", "#", "#region", "#endregion"],
			}],
			"radix": "error", // parseInt 必须要指明是十进制。
			"no-self-assign": "off",
			"no-debugger": "warn",
			"no-use-before-define": "off",
			"accessor-pairs": "off",
			"no-empty-function": "off",
			"no-inner-declarations": "warn",
			"no-unmodified-loop-condition": "off",
			"no-return-assign": "off",
			"no-redeclare": "off",
			"@stylistic/no-mixed-operators": "off",
			"@stylistic/no-extra-parens": ["error", "all", { "ignoreJSX": "multi-line", "conditionalAssign": false }],
			"no-void": ["off", { "allowAsStatement": true }], // 我就是要使用 void。
			"no-labels": "off",
			"no-label-var": "error",
			"default-case-last": "off",
			"no-useless-constructor": "off", // private constructor() { } 你跟我说无用？
			"@stylistic/no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0, "maxBOF": 0 }],
			"no-unused-expressions": ["error", {
				"allowShortCircuit": true,
				"allowTernary": true,
				"allowTaggedTemplates": true,
				"enforceForJSX": true,
			}],
			"@stylistic/max-statements-per-line": "off",
			// "no-useless-assignment": "error", // 不支持 Vue 模板变量引用。
			"no-control-regex": "off",
			"prefer-numeric-literals": "error",
			"@stylistic/generator-star-spacing": ["error", {
				"before": false,
				"after": true,
				"method": { "before": true, "after": false },
			}],
			"prefer-rest-params": "off",
			"import/order": ["warn", {
				"alphabetize": { "order": "asc", "orderImportKind": "asc", "caseInsensitive": false },
				"named": true,
			}],
			"import/first": "off", // 与 Vue 特性冲突。
			"import/named": "off", // 与 TypeScript 特性冲突。
			"import/no-named-as-default": "off", // 似乎与文件命名方式有点出入。
			"import/no-named-as-default-member": "off", // 某些库在导出成员时用 TS 命名空间欺诈。
			"n/no-callback-literal": "off", // 这是啥？
			"unicorn/escape-case": ["error", "lowercase"],
			"unicorn/number-literal-case": ["error", { "hexadecimalValue": "lowercase" }],
			"unicorn/prefer-code-point": "error",
			"unicorn/better-regex": "off",
			"unicorn/consistent-empty-array-spread": "error",
			"unicorn/consistent-existence-index-check": "error",
			"unicorn/explicit-length-check": "error",
			"unicorn/no-array-push-push": "error",
			"unicorn/no-console-spaces": "error",
			"unicorn/no-document-cookie": "error",
			"unicorn/prefer-string-replace-all": "error",
			"unicorn/no-useless-length-check": "error",
			"jsdoc/require-jsdoc": "off",
			"jsdoc/tag-lines": "off",
			"jsdoc/require-param": ["warn", {
				"enableFixer": false,
				"checkDestructuredRoots": false,
			}],
			"jsdoc/check-param-names": ["warn", {
				"checkDestructured": false,
				"allowExtraTrailingParamDocs": true,
				"disableExtraPropertyReporting": true,
			}],
			"jsdoc/check-tag-names": ["error", {
				"definedTags": ["note", "remarks", "memberOf", "category", "warn", "notdeprecated"],
			}],
			"jsdoc/require-hyphen-before-param-description": ["error", "always", { "tags": { "template": "always" } }],
			"jsdoc/require-returns": ["warn", {
				"checkGetters": false,
				"exemptedBy": ["inheritdoc", "deprecated"],
			}],
			"jsdoc/require-asterisk-prefix": "error",
			"jsdoc/no-multi-asterisks": ["error", { "allowWhitespace": true }],
			// "jsdoc/check-examples": ["error", {
			// 	"exampleCodeRegex": "```",
			// }],
			"jsdoc/require-returns-check": "off",
			"jsdoc/empty-tags": "off",
			"@typescript-eslint/no-unused-vars": ["warn", { // 非要使用未使用变量，前面加下划线。
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_|^props$|^emits$",
				"caughtErrorsIgnorePattern": "^_",
			}],
			"no-unused-private-class-members": "warn",
			"@typescript-eslint/no-inferrable-types": ["error", { "ignoreParameters": true, "ignoreProperties": true }],
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/triple-slash-reference": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/ban-types": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/consistent-type-assertions": ["error", { "assertionStyle": "as" }],
			"@typescript-eslint/no-confusing-non-null-assertion": "error",
			"@typescript-eslint/no-duplicate-enum-values": "error",
			"@typescript-eslint/no-empty-interface": "off",
			"@stylistic/member-delimiter-style": ["error", {
				"multiline": {
					"delimiter": "semi",
					"requireLast": true,
				},
				"singleline": {
					"delimiter": "semi",
					"requireLast": false,
				},
			}],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-use-before-define": ["warn", {
				"functions": false,
			}],
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-redeclare": "warn",
			"@typescript-eslint/no-useless-constructor": "error",
			"@typescript-eslint/no-this-alias": "off",
			"@stylistic/indent-binary-ops": "error",
			"@stylistic/type-generic-spacing": "error",
			"@stylistic/type-named-tuple-spacing": "error",
			"@typescript-eslint/no-confusing-void-expression": "off", // 不是很好用。
			"@typescript-eslint/no-floating-promises": "off", // 不是很好用。
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
			"@typescript-eslint/strict-boolean-expressions": ["off", { // 如需检查错误时可再临时手动开启。
				"allowString": false,
				"allowNumber": false,
				"allowNullableObject": false,
				"allowNullableBoolean": true,
				"allowNullableString": false,
				"allowNullableNumber": false,
				"allowNullableEnum": false,
				"allowAny": false,
			}],
			"@typescript-eslint/no-unnecessary-type-assertion": "error",
			"@typescript-eslint/no-unnecessary-type-constraint": "error",
			"@typescript-eslint/no-unnecessary-type-parameters": "error",
			"@typescript-eslint/no-unnecessary-type-arguments": "error",
			"@typescript-eslint/no-unnecessary-template-expression": "error",
			"@typescript-eslint/no-unnecessary-qualifier": "off", // 开启后，某些包含复杂类型的特殊文件会把 eslint 弄崩。
			"@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
			"@typescript-eslint/no-unnecessary-condition": ["off", { "allowConstantLoopConditions": true }],
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/no-unused-expressions": ["error", {
				"allowShortCircuit": true,
				"allowTernary": true,
				"enforceForJSX": true,
			}],
			// "@typescript-eslint/prefer-readonly-parameter-types": "error",
			"@typescript-eslint/prefer-reduce-type-parameter": "error",
			"vue/html-indent": ["error", "tab"],
			"vue/script-indent": ["error", "tab", {
				"baseIndent": 1,
				"switchCase": 1,
			}],
			"vue/html-self-closing": ["error", {
				"html": {
					"void": "always",
					"normal": "any",
					"component": "always",
				},
				"svg": "always",
				"math": "always",
			}],
			"vue/no-export-in-script-setup": "error",
			"vue/no-duplicate-attributes": "error",
			"vue/no-reserved-component-names": "error",
			"vue/no-use-v-if-with-v-for": "error",
			"vue/no-v-text-v-html-on-component": "error",
			"vue/html-quotes": ["error", "double", { "avoidEscape": true }],
			"vue/component-definition-name-casing": ["error", "PascalCase"],
			"vue/no-multi-spaces": "error",
			"vue/no-spaces-around-equal-signs-in-attribute": "error",
			"vue/prop-name-casing": ["error", "camelCase"],
			"vue/v-slot-style": "error",
			"vue/html-closing-bracket-spacing": "error",
			"vue/html-closing-bracket-newline": ["error", {
				"singleline": "never",
				"multiline": "always",
			}],
			"vue/no-v-html": "error",
			"vue/this-in-template": ["error", "never"],
			"vue/html-comment-content-spacing": ["error", "always"],
			"vue/array-bracket-spacing": ["error", "never"],
			"vue/arrow-spacing": "error",
			"vue/block-spacing": "error",
			"vue/brace-style": ["error", "1tbs", { "allowSingleLine": true }],
			"vue/comma-dangle": ["error", "always-multiline"],
			"vue/comma-spacing": ["error", { "before": false, "after": true }],
			"vue/comma-style": ["error", "last"],
			"vue/dot-location": ["error", "property"],
			"vue/dot-notation": ["error"],
			"vue/func-call-spacing": ["error", "never"],
			"vue/eqeqeq": ["error", "always", { "null": "ignore" }],
			"vue/no-irregular-whitespace": "error",
			"vue/no-loss-of-precision": "error",
			"vue/no-useless-concat": "error",
			"vue/object-curly-spacing": ["error", "always"],
			"vue/object-shorthand": "error",
			"vue/prefer-template": "off",
			"vue/quote-props": ["error", "as-needed"],
			"vue/space-in-parens": ["error", "never"],
			"vue/space-infix-ops": "error",
			"vue/space-unary-ops": "error",
			"vue/template-curly-spacing": "error",
			"vue/key-spacing": "error",
			"vue/keyword-spacing": "error",
			"vue/multi-word-component-names": "off",
			"vue/mustache-interpolation-spacing": "error",
			"vue/attribute-hyphenation": ["error", "never"],
			"vue/singleline-html-element-content-newline": "off",
			"vue/no-unused-vars": "warn",
			"vue/no-v-model-argument": "off",
			"vue/require-typed-ref": "error",
			"vue/block-lang": ["error", {
				"script": {
					"lang": ["ts", "tsx"],
				},
				"style": {
					"lang": "scss",
				},
				"i18n": {
					"lang": "json5",
				},
			}],
			"vue/block-tag-newline": ["error", {
				"singleline": "always",
				"multiline": "always",
				"maxEmptyLines": 0,
			}],
			"vue/define-macros-order": ["off", { // 与 typescript 冲突了。
				"order": ["defineProps", "defineEmits"],
			}],
			"vue/component-options-name-casing": ["error", "PascalCase"],
			"vue/next-tick-style": ["error", "promise"],
			"vue/padding-line-between-blocks": ["error", "always"],
			"vue/block-order": ["error", {
				"order": ["docs", ["script:not([setup])", "script[setup]"], "template", "i18n", "style[scoped]", "style[module]", "style:not([scoped]):not([module])"],
			}],
			"vue/no-multiple-template-root": "off",
			"vue/multiline-html-element-content-newline": "off",
			"vue/no-template-shadow": "off",
			"vue/no-mutating-props": ["off", { "shallowOnly": false }],
			"vue/no-deprecated-filter": "off", // 我要按位或，不是要什么过滤器。
			"vue/no-dupe-keys": "off",
			"vue/no-v-for-template-key": "off", // 官方说明：它会和 vue/no-v-for-template-key-on-child 规则打架。
			"vue/v-on-event-hyphenation": ["error", "never", { "autofix": true }],
			"vue/max-attributes-per-line": ["error", {
				"singleline": 5,
				"multiline": 1,
			}],
			"vue/first-attribute-linebreak": ["error", {
				"singleline": "ignore",
				"multiline": "below",
			}],
			"no-restricted-properties": ["error", {
				object: "arguments",
				property: "callee",
				message: "arguments.callee is deprecated.",
			}, {
				object: "global",
				property: "isFinite",
				message: "Please use Number.isFinite instead.",
			}, {
				object: "self",
				property: "isFinite",
				message: "Please use Number.isFinite instead.",
			}, {
				object: "window",
				property: "isFinite",
				message: "Please use Number.isFinite instead.",
			}, {
				object: "globalThis",
				property: "isFinite",
				message: "Please use Number.isFinite instead.",
			}, {
				object: "global",
				property: "isNaN",
				message: "Please use Number.isNaN instead.",
			}, {
				object: "self",
				property: "isNaN",
				message: "Please use Number.isNaN instead.",
			}, {
				object: "window",
				property: "isNaN",
				message: "Please use Number.isNaN instead.",
			}, {
				object: "globalThis",
				property: "isNaN",
				message: "Please use Number.isNaN instead.",
			}, {
				property: "__defineGetter__",
				message: "Please use Object.defineProperty instead.",
			}, {
				property: "__defineSetter__",
				message: "Please use Object.defineProperty instead.",
			}, {
				property: "__lookupGetter__",
				message: "Please use Object.getOwnPropertyDescriptor instead.",
			}, {
				property: "__lookupSetter__",
				message: "Please use Object.getOwnPropertyDescriptor instead.",
			}, {
				property: "__proto__",
				message: "Please use Object.getPrototypeOf instead.",
			}, {
				object: "Math",
				property: "pow",
				message: "Please use the exponentiation operator (**) instead.",
			}],
			"no-restricted-globals": ["error", {
				name: "arguments",
				message: "arguments is deprecated.",
			}, {
				name: "isFinite",
				message: "Please use Number.isFinite instead.",
			}, {
				name: "isNaN",
				message: "Please use Number.isNaN instead.",
			}, {
				name: "addEventListener",
				message: "Please use window.addEventListener instead.",
			}, {
				name: "removeEventListener",
				message: "Please use window.removeEventListener instead.",
			}, {
				name: "innerHeight",
				message: "Please use window.innerHeight instead.",
			}, {
				name: "outerHeight",
				message: "Please use window.outerHeight instead.",
			}, {
				name: "innerWidth",
				message: "Please use window.innerWidth instead.",
			}, {
				name: "outerWidth",
				message: "Please use window.outerWidth instead.",
			}, {
				name: "open",
				message: "Please use window.open instead.",
			}, {
				name: "matchMedia",
				message: "Please use window.matchMedia instead.",
			}, {
				name: "print",
				message: "Please use window.print instead.",
			}, /* {
				name: "Number",
				message: "Use + instead.",
			}, {
				name: "Boolean",
				message: "Use !! instead.",
			} */],
			"no-restricted-syntax": ["error", {
				selector: ":not(ForOfStatement, ForInStatement) > VariableDeclaration[kind = 'let'] > VariableDeclarator[init = null]:not([id.typeAnnotation])",
				message: "Type must be inferred at variable declaration",
			}],
		},
	},
	{
		files: ["*.config.{js,ts}"],
		rules: {
			"@stylistic/quote-props": "off",
			"import/order": "off",
		},
	},
	{
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"no-var": "off", // 在 globalThis 中声明成员时必须要用 var（不能使用 let 或 const）！参见：https://stackoverflow.com/a/69429093/19553213
		},
	},
	{
		files: ["*.{js,jsx}"],
		rules: {
			"jsdoc/check-tag-names": "off",
			"jsdoc/no-types": "off",
			"jsdoc/require-param-type": "error",
			"jsdoc/require-returns-type": "error",
			"jsdoc/require-property-type": "error",
		},
	},
	{
		ignores: [
			"**/dist/*",
			".output/*",
			"node_modules/*",
			".nuxt/*",
			"proto/*",
		],
	},
];
