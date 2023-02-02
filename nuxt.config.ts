// https://v3.nuxtjs.org/api/configuration/nuxt.config

import CopyPlugin from "copy-webpack-plugin";
import { resolve } from "path";
import styleResources from "./helpers/style-resources";
const wasmFile = resolve("node_modules/mediainfo.js/dist/MediaInfoModule.wasm");
type _NuxtConfig = Parameters<typeof defineNuxtConfig>[0] & Record<string, object>; // 还敢报错吗？

export default defineNuxtConfig({
	plugins: [
		"plugins/ripple.ts",
	],
	modules: [
		"@nuxtjs/i18n",
		"@nuxt/content",
		"nuxt-icons",
		"@vueuse/nuxt",
		"modules/theme/module.ts",
		"modules/noscript/module.ts",
		"@nuxtjs/robots",
		"nuxt-simple-sitemap",
		// "@nuxtjs/color-mode", // 这个已经重写了，不用开启。
	],
	build: {
		plugins: [
			new CopyPlugin({
				patterns: [
					{
						from: wasmFile,
						to: ".",
					},
					{
						from: "CNAME",
						to: ".",
					},
				],
			}),
		],
	},
	alias: {
		styles: resolve(__dirname, "./assets/styles"),
		components: resolve(__dirname, "./components"),
		composables: resolve(__dirname, "./composables"),
		layouts: resolve(__dirname, "./layouts"),
		pages: resolve(__dirname, "./pages"),
		plugins: resolve(__dirname, "./plugins"),
		static: resolve(__dirname, "./public/static"),
		lotties: resolve(__dirname, "./assets/lotties"),
		modules: resolve(__dirname, "./modules"),
		content: resolve(__dirname, "./content"),
		middleware: resolve(__dirname, "./middleware"),
		server: resolve(__dirname, "./server"),
		helpers: resolve(__dirname, "./helpers"),
	},
	css: [
		"styles/global.scss",
		"styles/global-colors.scss",
	],
	vite: {
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
					import: [
						"styles/_theme.scss",
					],
				},
			}),
			modules: {
				localsConvention: "camelCaseOnly",
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
		vueI18n: {
			legacy: false,
			locale: "zh",
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
	runtimeConfig: {
		public: {
			siteUrl: "http://localhost:3000",
		},
	},
} as _NuxtConfig);
