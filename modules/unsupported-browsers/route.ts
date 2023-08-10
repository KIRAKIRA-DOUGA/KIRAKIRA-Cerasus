import { defineEventHandler, setHeader } from "h3";
import { createReadFileResolver } from "../shared/encode";
import { IE_PAGE_HTML_FILE } from "./module";
import { PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";

export default defineEventHandler(async e => {
	const { readFile, resolve } = createReadFileResolver(import.meta.url);
	const IE_PAGE_HTML_RELATIVE_PATH = resolve("..", PREFERENTIAL_TEMPLATE_PATH, IE_PAGE_HTML_FILE);

	setHeader(e, "Content-Type", "text/html");
	if (!process.dev)
		setHeader(e, "Cache-Control", "max-age=600, must-revalidate");

	const iePageHtml = await readFile(IE_PAGE_HTML_RELATIVE_PATH);
	return iePageHtml;
});
