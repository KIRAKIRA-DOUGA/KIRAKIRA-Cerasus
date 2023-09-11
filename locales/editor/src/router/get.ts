import getLocales from "../utils/get-locales.js";

const handleGetLocales: ServerHandler = (request, response) => {
	if (request.method === "GET" && request.url === "/get") {
		getLocales().then(data => {
			const stringify = JSON.stringify(data);
			response.end(stringify);
		});
		return true;
	}
};

export default handleGetLocales;
