import { defineEventHandler, setHeader, getRequestURL } from "h3";
import { PREFERENTIAL_ROUTE } from "../shared/constants";
import { IE_PAGE_HTML_FILE } from "./constants";

export default defineEventHandler(async e => {
	setHeader(e, "Content-Type", "text/html");
	if (!process.dev)
		setHeader(e, "Cache-Control", "max-age=600, must-revalidate");

	const url = getRequestURL(e);
	url.protocol = "https:";
	url.pathname = PREFERENTIAL_ROUTE + IE_PAGE_HTML_FILE;
	const iePageHtml = await (await fetch(url)).text();
	return iePageHtml;
});
