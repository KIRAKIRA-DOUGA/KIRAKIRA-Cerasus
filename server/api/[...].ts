export default defineEventHandler(async event => {
	const url = getRequestURL(event);
	Object.assign(url, {
		protocol: "https:",
		port: "",
		host: "kirakira.dev",
	} satisfies Partial<URL>);
	const headers = getHeaders(event) as HeadersInit;
	const uselessHeaders = ["cookie", "accept-language", "accept-encoding", "sec-fetch-dest", "sec-fetch-user", "sec-fetch-mode", "sec-fetch-site", "accept", "user-agent", "upgrade-insecure-requests", "dnt", "sec-ch-ua-platform", "sec-ch-ua-mobile", "sec-ch-ua", "cache-control", "pragma", "connection", "host", "x-forwarded-for", "x-forwarded-port", "x-forwarded-proto"] as const;
	for (const header of uselessHeaders)
		delete (headers as AnyObject)[header];
	const method = getMethod(event);
	let body;
	try {
		body = await readBody(event);
	} catch (error) { }
	return await fetch(url, {
		method,
		body,
		headers,
		credentials: "same-origin",
	}).then(response => response.json());
});
