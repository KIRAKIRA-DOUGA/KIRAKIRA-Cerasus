import { addTemplate, createResolver, defineNuxtModule } from "@nuxt/kit";
import { promises } from "fs";

export default defineNuxtModule({
	setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		addTemplate({
			filename: "noscript.html",
			write: true,
			dst: resolve(__dirname, "../../public/noscript.html"),
			getContents() {
				const src = resolve(__dirname, "noscript.html");
				return promises.readFile(src, "utf-8");
			},
		});
		const noscriptPath = "/noscript.html";
		const head = nuxt.options.app.head ??= [] as typeof nuxt.options.app.head;
		head.noscript ??= [];
		head.noscript.push({
			children: `<iframe class="noscript-mask" src="${noscriptPath}"></iframe>`,
		});
	},
});
