/// <reference path="../types/global.d.ts" />
import handleGetLocales from "./router/get.js";
import handleEditorApp from "./router/editor.js";

const serverHandler: ServerHandler = (request, response) => {
	// 设置返回格式 JSON
	response.setHeader("Content-type", "application/json");

	if (handleEditorApp(request, response)) return true;
	if (handleGetLocales(request, response)) return true;

	// 未命中路由
	response.writeHead(404, { "Content-type": "text/plain" });
	response.write("404 Not Found\n");
	response.end();
};

export default serverHandler;
