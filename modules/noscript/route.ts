import { defineEventHandler, setHeader, getRequestURL } from "h3";
import { NOSCRIPT_PATH } from "./constants";

export default defineEventHandler(async e => {
	setHeader(e, "Content-Type", "text/html");
	if (!process.dev)
		setHeader(e, "Cache-Control", "max-age=600, must-revalidate");

	const url = getRequestURL(e);
	url.protocol = "https:";
	url.pathname = NOSCRIPT_PATH;
	const lang = url.searchParams.get("lang") ?? "zh-Hans-CN";
	let noscriptHtml = await (await fetch(url)).text();
	noscriptHtml = noscriptHtml.replace(/(?<=html lang=").*?(?=")/, lang);
	return noscriptHtml;
});
