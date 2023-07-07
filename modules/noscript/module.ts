import { addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_ROUTE, TEMPLATE_PATH } from "../shared/constants";

const TEMPLATE_NAME = "noscript.html";

export default defineNuxtModule({
	setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		addTemplate({
			filename: TEMPLATE_PATH + TEMPLATE_NAME,
			write: true,
			src: resolve(__dirname, TEMPLATE_NAME),
		});
		const NOSCRIPT_PATH = PREFERENTIAL_ROUTE + TEMPLATE_NAME;
		const head = nuxt.options.app.head ??= [] as typeof nuxt.options.app.head;
		head.noscript ??= [];
		head.noscript.push({
			children: `<iframe class="noscript-mask" src="${NOSCRIPT_PATH}" aria-label="警告，JavaScript被禁用！"></iframe>`,
		});
	},
});
