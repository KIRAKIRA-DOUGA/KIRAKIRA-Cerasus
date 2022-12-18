// https://v3.nuxtjs.org/api/configuration/nuxt.config

import { resolve } from "path";
import styleResources from "./modules/style-resources";

export default defineNuxtConfig({
	plugins: [
		"plugins/ripple.ts",
	],
	alias: {
		styles: resolve(__dirname, "./assets/styles"),
		components: resolve(__dirname, "./components"),
		composables: resolve(__dirname, "./composables"),
		layouts: resolve(__dirname, "./layouts"),
		modules: resolve(__dirname, "./modules"),
		pages: resolve(__dirname, "./pages"),
		plugins: resolve(__dirname, "./plugins"),
		"static": resolve(__dirname, "./public/static"),
		lotties: resolve(__dirname, "./assets/lotties"),

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
					"import": [
						"styles/_theme.scss",
					],
				},
			}),
			modules: {
				localsConvention: "camelCaseOnly",
			},
		},
	},
});
