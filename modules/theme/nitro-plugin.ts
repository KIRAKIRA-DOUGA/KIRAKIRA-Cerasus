// @ts-nocheck
import { Nitro } from "nitropack";
import { getFunctionBody } from "./module";
import script from "./script";
export default (function (nitro: Nitro) {
	nitro.hooks.hook("render:html", htmlContext => {
		htmlContext.head.push(`<script>(function (autoCall) {${getFunctionBody(script, true)}})();</script>`);
		// 不要用 <script type="module">，否则会有延迟。
	});
});
