import { defineEventHandler, setHeader, sendStream } from "h3";
import { createReadFileResolver, getPathFromEsModule } from "../shared/encode";
import { IE_PAGE_HTML_FILE } from "./module";
import { PREFERENTIAL_TEMPLATE_PATH } from "../shared/constants";
import fs from "fs";
import { resolve } from "path";

export default defineEventHandler(async e => {
	// const { readFile, resolve } = createReadFileResolver(import.meta.url);
	// const IE_PAGE_HTML_RELATIVE_PATH = resolve("..", PREFERENTIAL_TEMPLATE_PATH, IE_PAGE_HTML_FILE);
	
	setHeader(e, "Content-Type", "text/plain");
	if (!process.dev)
		setHeader(e, "Cache-Control", "max-age=600, must-revalidate");
	
	const path = getPathFromEsModule(import.meta.url);
	const result: string[] = [];
	result.push("filename: " + path.__filename);
	result.push("dirname: " + path.__dirname);
	result.push("");
	
	let lastPath = "";
	let curPath = path.__dirname;
	while (lastPath !== curPath) {
		result.push(curPath);
		const files = await fs.promises.readdir(curPath);
		result.push(...files);
		result.push("");
		lastPath = curPath;
		curPath = resolve(curPath, "..");
	}
	
	return result.join("\n");
	
	// return await (await e.fetch("https://localhost:3000/prior/601.html", { method: "POST" })).text();
	// return sendStream(e, createReadStream("modules/unsupported-browsers/601.html"));

	// const iePageHtml = await readFile(IE_PAGE_HTML_RELATIVE_PATH);
	// return iePageHtml;
});
