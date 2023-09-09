import { NOSCRIPT_ROUTE } from "./constants";

export default defineNitroPlugin(nitro => {
	nitro.hooks.hook("render:html", html => {
		const lang = html.htmlAttrs.map(attr => attr.match(/lang="(.*)"/)?.[1]).find(attr => attr);
		const noscriptPath = !lang ? NOSCRIPT_ROUTE : NOSCRIPT_ROUTE + `?lang=${lang}`;
		html.head.push(`<noscript><iframe class="noscript-mask" src="${noscriptPath}" aria-label="警告，JavaScript被禁用！"></iframe><form><button></button></form></noscript>`);
	});
});
