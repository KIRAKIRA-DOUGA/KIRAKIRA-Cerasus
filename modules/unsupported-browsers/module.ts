import { addImports, addPlugin, addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { readFile as _readFile } from "fs/promises";
import { dirname } from "path";
import { PREFERENTIAL_BASE_URL, PREFERENTIAL_ROUTE, TEMPLATE_PATH } from "../shared/constants";
import { compileTypeScript, createReadFileResolver, minifyHtml, minifyJavaScript, useNuxtHead, wrapIife } from "../shared/encode";

const IE_PAGE_HTML_FILE = "601.html";
const IE_PAGE_SCRIPT_FILE = "jump-if-ie";
const IE_PAGE_SCRIPT_FILE_TS = IE_PAGE_SCRIPT_FILE + ".ts", IE_PAGE_SCRIPT_FILE_JS = IE_PAGE_SCRIPT_FILE + ".js";

export default defineNuxtModule({
	async setup(_options, nuxt) {
		const { readFile } = createReadFileResolver(__dirname);

		let iePageHtml = await readFile(IE_PAGE_HTML_FILE);
		iePageHtml = await minifyHtml(iePageHtml);
		addTemplate({
			filename: TEMPLATE_PATH + IE_PAGE_HTML_FILE,
			write: true,
			getContents: () => iePageHtml,
		});

		let iePageScript = await readFile(IE_PAGE_SCRIPT_FILE_TS);
		iePageScript = compileTypeScript(iePageScript, "ES5");
		iePageScript = wrapIife(iePageScript);
		iePageScript = await minifyJavaScript(iePageScript);
		addTemplate({
			filename: TEMPLATE_PATH + IE_PAGE_SCRIPT_FILE_JS,
			write: true,
			getContents: () => iePageScript,
		});

		const IE_PAGE_SCRIPT_PATH = PREFERENTIAL_ROUTE + IE_PAGE_SCRIPT_FILE_JS;
		const head = useNuxtHead(nuxt);
		head.script ??= [];
		head.script.push({ src: IE_PAGE_SCRIPT_PATH });

		/* nuxt.options.nitro.publicAssets = nuxt.options.nitro.publicAssets || [];
		nuxt.options.nitro.publicAssets.push({
			baseURL: PREFERENTIAL_BASE_URL,
			dir: dirname(template.dst),
		}); */
	},
});
