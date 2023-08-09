import { addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_ROUTE, TEMPLATE_PATH } from "../shared/constants";
import { createReadFileResolver, minifyHtml, useNuxtHead } from "../shared/encode";

const NOSCRIPT_HTML_FILE = "noscript.html";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { readFile } = createReadFileResolver(__dirname);

		let noscriptHtml = await readFile(NOSCRIPT_HTML_FILE);
		noscriptHtml = await minifyHtml(noscriptHtml);
		addTemplate({
			filename: TEMPLATE_PATH + NOSCRIPT_HTML_FILE,
			write: true,
			getContents: () => noscriptHtml,
		});

		const NOSCRIPT_PATH = PREFERENTIAL_ROUTE + NOSCRIPT_HTML_FILE;
		const head = useNuxtHead(nuxt);
		head.noscript ??= [];
		head.noscript.push({
			children: `<iframe class="noscript-mask" src="${NOSCRIPT_PATH}" aria-label="警告，JavaScript被禁用！"></iframe>`,
		});
	},
});
