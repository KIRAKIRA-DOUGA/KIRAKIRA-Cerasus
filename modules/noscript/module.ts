import { addTemplate, defineNuxtModule } from "@nuxt/kit";
import { PREFERENTIAL_ROUTE, PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import { compileSassFile, createReadFileResolver, minifyHtml, useNuxtHead } from "../shared/encode";

const NOSCRIPT_HTML_FILE = "noscript.html";
const NOSCRPIT_SCSS_FILE = "style.scss";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { readFile } = createReadFileResolver(__dirname);

		let noscriptHtml = await readFile(NOSCRIPT_HTML_FILE);
		const noscriptStyle = compileSassFile(__dirname, NOSCRPIT_SCSS_FILE);
		noscriptHtml = noscriptHtml.replace(/(?=\s*<\/head>)/, `\n<style>\n${noscriptStyle}\n</style>`);
		noscriptHtml = await minifyHtml(noscriptHtml);
		addTemplate({
			filename: PREFERENTIAL_TEMPLATE_PATH + NOSCRIPT_HTML_FILE,
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
