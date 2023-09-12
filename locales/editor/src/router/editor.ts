import { __dirname } from "../utils/get-locales.js";
import { resolve } from "path";
import { readFile } from "fs/promises";

const handleEditorApp: ServerHandler = (request, response) => {
	if (request.method === "GET" && request.url === "/") {
		readFile(resolve(__dirname, "../..", "index.html"), "utf-8").then(data => {
			response.setHeader("Content-type", "text/html");
			response.end(data);
		});
		return true;
	}
	if (request.method === "GET" && request.url === "/client.js") {
		readFile(resolve(__dirname, "..", "client.js"), "utf-8").then(data => {
			response.setHeader("Content-type", "application/javascript");
			response.end(data);
		});
		return true;
	}
};

export default handleEditorApp;
