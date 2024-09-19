// https://v3.nuxtjs.org/api/configuration/nuxt.config

import pomsky from "@pomsky-lang/unplugin";
import defineAlias from "./helpers/alias";
import styleResources from "./helpers/style-resources";
import cssDoodleLoader from "./plugins/vite/css-doodle";
import docsLoader from "./plugins/vite/docs";
import vitePluginScssVariables from "./plugins/vite/scss-variables";
import scssVariablesLoader from "./plugins/vite/scss-variables-loader";
import { environment } from "./utils/environment";
/* import vueNestedSFC from "vite-plugin-vue-nested-sfc"; */
type OriginalNuxtConfig = Parameters<typeof defineNuxtConfig>[0];
type BroadNuxtConfig = OriginalNuxtConfig & Record<Exclude<string, keyof OriginalNuxtConfig>, object | string>; // 还敢报错吗？
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // 支持 HTTPS。
const dev = environment.development;

export default defineNuxtConfig({
	devtools: {
		enabled: true,
	},

	plugins: [
		"plugins/vue/ripple.ts",
		"plugins/vue/css-var-i.ts",
		"plugins/vue/tooltip.ts",
		"plugins/vue/gesture.ts",
	],

	modules: [
		// "@nuxt/devtools",
		"@nuxtjs/i18n",
		"@nuxt/content",
		"@nuxt/image",
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
		"@nuxtjs/sitemap",
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
		"types",
		"utils",
		"workers",
		"assets/pomsky",
		"composables/api",
	),

	css: [
		"styles/global.scss",
		"styles/global-colors.scss",
		"styles/elements/_index.scss",
		"vue-virtual-scroller/dist/vue-virtual-scroller.css",
		"vue-cropper/dist/index.css",
	],

	vite: {
		plugins: [
			docsLoader(),
			cssDoodleLoader(),
			vitePluginScssVariables(),
			scssVariablesLoader(),
			pomsky.vite({
				fileExtensions: [".vue"],
			}),
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
		worker: {
			format: "es",
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
		assetsInclude: [
			"**/*.vtt",
		],
	},

	nitro: {
		devProxy: {
			"/api": {
				target: "https://rosales.kirakira.moe",
				prependPath: true,
				changeOrigin: true,
			},
		},
		compressPublicAssets: {
			brotli: true,
		},
		esbuild: {
			options: {
				target: "esnext",
			},
		},
	},

	build: {
		vendor: [
			"vue-cropper",
		],
		plugins: [
			{ src: "~/plugins/vue-cropper", ssr: false },
		],
	},

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
			{ code: "zhs", language: "zh-CN", name: "简体中文" },
			{ code: "zht", language: "zh-TW", name: "繁體中文" },
			{ code: "en", language: "en-US", name: "English" },
			{ code: "ja", name: "日本語" },
			{ code: "ko", name: "한국어" },
			{ code: "vi", name: "Tiếng Việt" },
			{ code: "id", name: "Bahasa Indonesia" },
			{ code: "fr", name: "Français" },
			{ code: "yue", name: "廣東話" },
		],
		defaultLocale: "zhs",
		vueI18n: "./i18n.config.ts",
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "language",
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

	image: {
		format: ["avif", "webp"], // 只适用于 <NuxtPicture>，对 <NuxtImg> 无效。
		providers: {
			kirakira: {
				name: "kirakira", // optional value to overrider provider name
				provider: "./providers/nuxt-image/kirakira-image.ts", // Path to custom provider
				options: {
					// ... provider options
					baseURL: "https://kirafile.com",
					accountHash: "Gyz90amG54C4b_dtJiRpYg",
				},
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
			"components",
			"utils",
			"classes",
			"stores",
		],
	},

	postcss: {
		plugins: {
			"./plugins/postcss/component-root": true,
			"./plugins/postcss/any-hover": true,
			"./plugins/postcss/lang-latin": true,
			"postcss-combine-media-query": false,
		},
	},

	components: [
		{
			path: "components",
			pathPrefix: false,
		},
	],

	lodash: {
		exclude: ["now"],
	},

	site: {
		url: "https://kirakira.moe",
	},

	app: {
		pageTransition: {
			name: "page-jump",
			mode: "out-in",
		},
		rootId: "root",
		teleportId: "popovers",
	},

	runtimeConfig: {
		public: {
			/** Cloudflare MPD 视频清单 URL 模板，其中 "{videoId}" 部分将会被替换为真实的视频 ID */
			cloudflareMpdVideoUrlTemplate: "https://customer-yvgxn6arnuae3q89.cloudflarestream.com/{videoId}/manifest/video.mpd",
		},
	},

	robots: {
		credits: false,
		disallow: ["/search/", "/dev/", "/settings/", "/welcome/"],
	},

	compatibilityDate: "2024-08-25",
} as BroadNuxtConfig);
