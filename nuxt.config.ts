// https://v3.nuxtjs.org/api/configuration/nuxt.config

import defineAlias from "./helpers/alias";
import styleResources from "./helpers/style-resources";
import cssDoodleLoader from "./plugins/vite/css-doodle";
import docsLoader from "./plugins/vite/docs";
import vitePluginScssVariables from "./plugins/vite/scss-variables";
import { environment } from "./utils/environment";
/* import vueNestedSFC from "vite-plugin-vue-nested-sfc";
import CopyPlugin from "copy-webpack-plugin";
const wasmFile = resolve("node_modules/mediainfo.js/dist/MediaInfoModule.wasm"); */
type OriginalNuxtConfig = Parameters<typeof defineNuxtConfig>[0];
type BroadNuxtConfig = OriginalNuxtConfig & Record<Exclude<string, keyof OriginalNuxtConfig>, object | string>; // 还敢报错吗？
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // 支持 HTTPS。
const dev = environment.development;

export default defineNuxtConfig({
	plugins: [
		"plugins/vue/ripple.ts",
		"plugins/vue/css-var-i.ts",
		"plugins/vue/tooltip.ts",
	],
	modules: [
		// "@nuxt/devtools",
		"@nuxtjs/i18n",
		"@nuxt/content",
		dev && "nuxt-icons",
		!dev && "@nuxtjs/svg-sprite",
		"@vueuse/nuxt",
		"nuxt-lodash",
		["@pinia/nuxt", {
			autoImports: ["defineStore", "storeToRefs"],
		}],
		"@pinia-plugin-persistedstate/nuxt",
		"modules/theme/module.ts",
		"modules/noscript/module.ts",
		"modules/unsupported-browsers/module.ts",
		dev && "modules/components-globalized/module.ts",
		"@nuxtjs/robots",
		"nuxt-simple-sitemap",
		// "@nuxtjs/color-mode", // 这个已经重写了，不用开启。
	],
	alias: defineAlias(__dirname,
		"assets/styles",
		"components",
		"composables",
		"layouts",
		"pages",
		"plugins",
		"public/static",
		"assets/lotties",
		"modules",
		"content",
		"middleware",
		"server",
		"helpers",
		"classes",
		"locales",
		"stores",
		"api",
	),
	css: [
		"styles/global.scss",
		"styles/global-colors.scss",
		"styles/elements/_index.scss",
		"vue-virtual-scroller/dist/vue-virtual-scroller.css",
	],
	vite: {
		plugins: [
			docsLoader(),
			cssDoodleLoader(),
			vitePluginScssVariables(),
		],
		optimizeDeps: {
			needsInterop: [
				"mediainfo.js",
			],
			esbuildOptions: {
				target: "esnext",
			},
		},
		vue: {
			script: {
				defineModel: true,
				propsDestructure: true,
			},
		},
		build: {
			target: "esnext",
		},
		css: {
			preprocessorOptions: styleResources({
				scss: {
					use: [
						"sass:color",
						"sass:list",
						"sass:map",
						"sass:math",
						"sass:meta",
						"sass:selector",
						"sass:string",
					],
					useAsGlobal: [
						"styles/theme",
					],
				},
			}),
			modules: {
				localsConvention: "camelCaseOnly",
			},
		},
	},
	nitro: {
		/* devProxy: {
			"/api": {
				target: "https://kirakira.dev/api",
				prependPath: true,
				changeOrigin: true,
			},
		}, */
		compressPublicAssets: {
			brotli: true,
		},
		esbuild: {
			options: {
				target: "esnext",
			},
		},
	},
	/* build: {
		plugins: [
			new CopyPlugin({
				patterns: [{
					from: wasmFile,
					to: ".",
				}, {
					from: "CNAME",
					to: ".",
				}],
			}),
		],
	}, */
	vue: {
		compilerOptions: {
			isCustomElement(tag) {
				return (
					tag.includes("-") ||
					[
						"marquee",
						dev && "SvgIcon", // 将非开发/生产环境的对应组件故意视为原生元素。
						!dev && "NuxtIcon",
					].includes(tag)
				);
			},
		},
	},
	i18n: {
		locales: [
			{ code: "zh", name: "简体中文" },
			{ code: "en", name: "English" },
			{ code: "ja", name: "日本語" },
		],
		defaultLocale: "zh",
		vueI18n: "./i18n.config.ts",
		detectBrowserLanguage: {
			useCookie: true,
			alwaysRedirect: true,
		},
	},
	content: {
		markdown: {
			remarkPlugins: {
				"remark-emoji": {
					emoticon: true,
				},
			},
		},
		highlight: {
			theme: {
				default: "github-light",
				dark: "github-dark",
				sepia: "monokai",
			},
		},
	},
	piniaPersistedstate: {
		cookieOptions: {
			sameSite: "strict",
		},
		storage: "localStorage",
	},
	svgSprite: {
		input: "~/assets/icons",
	},
	imports: {
		dirs: [
			"classes",
			"stores",
		],
	},
	postcss: {
		plugins: {
			"./plugins/postcss/component-root": true,
			"./plugins/postcss/any-hover": true,
			"postcss-combine-media-query": true,
		},
	},
	components: [
		{
			path: "components",
			pathPrefix: false,
		},
	],
} as BroadNuxtConfig);
