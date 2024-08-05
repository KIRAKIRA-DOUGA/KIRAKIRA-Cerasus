// env
import globals from "globals";
// extends
import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/essential"],
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
		},
		languageOptions: {
			parserOptions: {
				parser: {
					ts: tseslint.parser,
				},
				sourceType: "module",
				ecmaVersion: "latest",
			},
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		files: ["**/*.{js,jsx,ts,tsx,vue}"],
		rules: {
			"@stylistic/indent": ["error", "tab", {
				SwitchCase: 1,
				flatTernaryExpressions: true,
				ignoredNodes: [
					"Program > .body",
					"TSFunctionType *", // stylistic typescript indent bug
					"TSMappedType *", // stylistic typescript indent bug
				],
				ignoreComments: true,
			}],
			"@stylistic/linebreak-style": ["error", "unix"],
			"@stylistic/quotes": ["error", "double", { avoidEscape: true }],
			"@stylistic/semi": ["error", "always"],
			"@stylistic/array-bracket-spacing": ["error", "never"],
			"@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"@stylistic/comma-dangle": ["error", "always-multiline"],
			"@stylistic/comma-spacing": ["error", { before: false, after: true }],
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
			"no-empty": ["error", { allowEmptyCatch: true }],
			"no-constant-condition": ["error", { checkLoops: false }],
			"eqeqeq": ["error", "always", { null: "ignore" }],
			"prefer-const": ["error", { destructuring: "all" }],
			"for-direction": "error",
			"getter-return": "error",
			"no-compare-neg-zero": "error",
			"no-cond-assign": ["error", "except-parens"],
			"@stylistic/no-extra-semi": "error",
			"no-irregular-whitespace": "error",
			"no-unreachable": "warn",
			"use-isnan": "error",
			"valid-typeof": "error",
			"curly": ["error", "multi"],
			"no-lonely-if": "off",
			"dot-notation": ["error"],
			"guard-for-in": "error",
			"no-extra-label": "off",
			"require-await": "error",
			"yoda": "error",
			"@stylistic/block-spacing": "error",
			"@stylistic/func-call-spacing": ["error", "never"],
			"@stylistic/computed-property-spacing": ["error", "never"],
			"@stylistic/no-whitespace-before-property": "error",
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/padded-blocks": ["error", "never"],
			"@stylistic/quote-props": ["error", "as-needed"],
			"@stylistic/semi-spacing": "error",
			"@stylistic/semi-style": ["error", "last"],
			"@stylistic/space-before-function-paren": ["error", {
				anonymous: "always",
				named: "never",
				asyncArrow: "always",
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
			"@stylistic/operator-linebreak": "off",
			"@stylistic/no-trailing-spaces": ["error", { skipBlankLines: true }],
			"one-var": "off",
			"@stylistic/arrow-parens": ["error", "as-needed"],
			"camelcase": "off",
			"@stylistic/spaced-comment": ["error", "always", {
				exceptions: ["+", "-", "*", "/"],
				markers: ["/", "!", "@", "#", "#region", "#endregion"],
			}],
			"radix": "error", // parseInt 必须要指明是十进制。
			"no-self-assign": "off",
			"no-debugger": "warn",
			"no-use-before-define": "off",
			"accessor-pairs": "off",
			"no-empty-function": "off",
			"require-jsdoc": "error",
			"valid-jsdoc": ["error", {
				requireReturn: false,
				requireParamType: false, // TypeScript 不需要 JSDoc 的 type。
				requireReturnType: false,
			}],
			"no-inner-declarations": "warn",
			"no-unmodified-loop-condition": "off",
			"no-return-assign": "off",
			"no-redeclare": "off",
			"@stylistic/no-mixed-operators": "off",
			"@stylistic/no-extra-parens": ["error", "all", { ignoreJSX: "multi-line" }],
			"no-void": ["off", { allowAsStatement: true }], // 我就是要使用 void。
			"no-labels": "off",
			"default-case-last": "off",
			"no-useless-constructor": "off", // private constructor() { } 你跟我说无用？
			"@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
			"no-unused-expressions": ["error", {
				allowShortCircuit: true,
				allowTernary: true,
				allowTaggedTemplates: true,
				enforceForJSX: true,
			}],
			"@stylistic/max-statements-per-line": "off",
			// "no-useless-assignment": "error", // TODO: ESLint 9.0 及其之后才开始支持
			"import/order": "off", // 与 VSCode 内置导入排序特性打架。
			"import/first": "off", // 与 Vue 特性冲突。
			"import/named": "off", // 与 TypeScript 特性冲突。
			"import/no-named-as-default": "off", // 似乎与文件命名方式有点出入。
			"import/no-named-as-default-member": "off", // 某些库在导出成员时用 TS 命名空间欺诈。
			"n/no-callback-literal": "off", // 这是啥？
			"unicorn/escape-case": "off", // 暂时禁用，待修复。
			"unicorn/number-literal-case": "off", // 同上，你真的觉得大写很好看吗？
			"@typescript-eslint/no-unused-vars": ["warn", { // 非要使用未使用变量，前面加下划线。
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_|^props$|^emits$",
				caughtErrorsIgnorePattern: "^_",
			}],
			"@typescript-eslint/no-inferrable-types": ["error", { ignoreParameters: true, ignoreProperties: true }],
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/triple-slash-reference": "off",
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/ban-types": "off",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "as" }],
			"@typescript-eslint/no-confusing-non-null-assertion": "error",
			"@typescript-eslint/no-duplicate-enum-values": "error",
			"@typescript-eslint/no-empty-interface": "off",
			"@stylistic/member-delimiter-style": ["error", {
				multiline: {
					delimiter: "semi",
					requireLast: true,
				},
				singleline: {
					delimiter: "semi",
					requireLast: false,
				},
			}],
			"@typescript-eslint/semi": ["error", "always"],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-use-before-define": ["warn", {
				functions: false,
			}],
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-redeclare": "warn",
			"@typescript-eslint/no-useless-constructor": "error",
			"@typescript-eslint/no-this-alias": "off",
			"@stylistic/indent-binary-ops": "error",
			"@stylistic/type-generic-spacing": "error",
			"@stylistic/type-named-tuple-spacing": "error",
			// "@typescript-eslint/no-confusing-void-expression": "error",
			// "@typescript-eslint/no-floating-promises": "error",
			// 嗯对这几个不晓得怎么用不了。
			"vue/html-indent": ["error", "tab"],
			"vue/script-indent": ["error", "tab", {
				baseIndent: 1,
				switchCase: 1,
			}],
			"vue/html-self-closing": ["error", {
				html: {
					void: "always",
					normal: "any",
					component: "always",
				},
				svg: "always",
				math: "always",
			}],
			"vue/no-export-in-script-setup": "error",
			"vue/no-duplicate-attributes": "error",
			"vue/no-reserved-component-names": "error",
			"vue/no-use-v-if-with-v-for": "error",
			"vue/no-v-text-v-html-on-component": "error",
			"vue/html-quotes": ["error", "double", { avoidEscape: true }],
			"vue/component-definition-name-casing": ["error", "PascalCase"],
			"vue/no-multi-spaces": "error",
			"vue/no-spaces-around-equal-signs-in-attribute": "error",
			"vue/prop-name-casing": ["error", "camelCase"],
			"vue/v-slot-style": "error",
			"vue/html-closing-bracket-spacing": "error",
			"vue/html-closing-bracket-newline": ["error", {
				singleline: "never",
				multiline: "always",
			}],
			"vue/no-v-html": "error",
			"vue/this-in-template": ["error", "never"],
			"vue/html-comment-content-spacing": ["error", "always"],
			"vue/array-bracket-spacing": ["error", "never"],
			"vue/arrow-spacing": "error",
			"vue/block-spacing": "error",
			"vue/brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"vue/comma-dangle": ["error", "always-multiline"],
			"vue/comma-spacing": ["error", { before: false, after: true }],
			"vue/comma-style": ["error", "last"],
			"vue/dot-location": ["error", "property"],
			"vue/dot-notation": ["error"],
			"vue/func-call-spacing": ["error", "never"],
			"vue/eqeqeq": ["error", "always", { null: "ignore" }],
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
				script: {
					lang: ["ts", "tsx"],
				},
				style: {
					lang: "scss",
				},
				i18n: {
					lang: "json5",
				},
			}],
			"vue/block-tag-newline": ["error", {
				singleline: "always",
				multiline: "always",
				maxEmptyLines: 0,
			}],
			"vue/define-macros-order": ["off", { // 与 typescript 冲突了。
				order: ["defineProps", "defineEmits"],
			}],
			"vue/component-options-name-casing": ["error", "PascalCase"],
			"vue/next-tick-style": ["error", "promise"],
			"vue/padding-line-between-blocks": ["error", "always"],
			"vue/component-tags-order": ["error", {
				order: ["docs", ["script:not([setup])", "script[setup]"], "template", "i18n", "style[scoped]", "style[module]", "style:not([scoped]):not([module])"],
			}],
			"vue/no-multiple-template-root": "off",
			"vue/multiline-html-element-content-newline": "off",
			"vue/no-template-shadow": "off",
			"vue/no-mutating-props": ["off", { shallowOnly: false }],
			"vue/no-deprecated-filter": "off", // 我要按位或，不是要什么过滤器。
			"vue/no-dupe-keys": "off",
			"vue/no-v-for-template-key": "off", // 官方说明：它会和 vue/no-v-for-template-key-on-child 规则打架。
			"vue/v-on-event-hyphenation": ["error", "never", { autofix: true }],
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
				object: "Math",
				property: "pow",
				message: "Use the exponentiation operator (**) instead.",
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
			}, /* {
				name: "Number",
				message: "Use + instead.",
			}, {
				name: "Boolean",
				message: "Use !! instead.",
			} */],
			"no-restricted-syntax": ["error", {
				selector: "VariableDeclaration[kind = 'let'] > VariableDeclarator[init = null]:not([id.typeAnnotation])",
				message: "Type must be inferred at variable declaration",
			}],
		},
	},
	{
		files: ["*.config.{js,ts}"],
		rules: {
			"@stylistic/quote-props": "off",
		},
	},
	{
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
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
