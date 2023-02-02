import { createResolver, defineNuxtModule } from "@nuxt/kit";
import { copyFileSync } from "fs";

export default defineNuxtModule({
	setup(_options, nuxt) {
		const { resolve } = createResolver(import.meta.url);
		copyFileSync(resolve(__dirname, "noscript.html"), resolve(__dirname, "../../public/noscript.html"));
		const noscriptPath = "/noscript.html";
		const head = nuxt.options.app.head ??= [] as typeof nuxt.options.app.head;
		head.noscript ??= [];
		head.noscript.push({
			children: `<iframe class="noscript-mask" src="${noscriptPath}" aria-label="警告，JavaScript被禁用！"></iframe>`,
		});
	},
});
