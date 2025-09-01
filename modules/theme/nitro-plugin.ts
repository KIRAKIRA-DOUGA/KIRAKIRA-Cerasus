import { THEME_COOKIE_BANDER_SCRIPT_ROUTE } from "./constants";

export default defineNitroPlugin(nitro => {
	nitro.hooks.hook("render:html", html => {
		html.htmlAttrs.push('class="wallpaper"'); // 加上缺省的主题色，在禁用 JavaScript 时生效。
		// html.head.push(`<script>(function (autoCall) {${getFunctionBody(script, true)}})();</script>`);
		// 不要用 <script type="module">，否则会有延迟。
		html.head.push(`<script src="${THEME_COOKIE_BANDER_SCRIPT_ROUTE}"></script>`);
		// 接下来在此处定义与本模块无关的其它需要直接修改 HTML 模板的部分。
		// html.bodyAppend.push('<div id="popovers"></div>');
	});
});
