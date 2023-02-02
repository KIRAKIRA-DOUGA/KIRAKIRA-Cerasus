type HtmlContext = Record<"body" | "bodyAppend" | "bodyAttrs" | "bodyPrepend" | "head" | "htmlAttrs", string[]>;

export default defineNitroPlugin(nitro => {
	nitro.hooks.hook("render:html", (html: HtmlContext) => {
		html.htmlAttrs.push('class="pink"'); // 加上缺省的主题色，在禁用 JavaScript 时生效。
		// html.head.push(`<script>(function (autoCall) {${getFunctionBody(script, true)}})();</script>`);
		// 不要用 <script type="module">，否则会有延迟。
		const scriptPath = "/_nuxt/.nuxt/theme.script.js";
		html.head.push(`<script src="${scriptPath}"></script>`);
	});
});
