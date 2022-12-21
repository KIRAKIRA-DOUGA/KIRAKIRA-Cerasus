// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { resolve } from "path";
import styleResources from "./modules/style-resources";

export default defineNuxtConfig({
	plugins: [
		"plugins/ripple.ts",
	],
	modules: [
		// "@nuxtjs/color-mode",
		"@nuxtjs/i18n",
		"@nuxt/content",
		// "@nuxtjs/robots",
		"modules/theme/module.ts",
	],
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
});
