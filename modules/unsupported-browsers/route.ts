import { defineEventHandler, setHeader } from "h3";
// import { getHost } from "../../utils/host";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async e => {
	setHeader(e, "Content-Type", "text/html");
	if (!process.dev)
		setHeader(e, "Cache-Control", "max-age=600, must-revalidate");

	// const nuxtApp = useNuxtApp();
	// const host = process.server ? nuxtApp.ssrContext!.event.node.req.headers.host! : window.location.host;
	
	const runtimeConfig = useRuntimeConfig();
	const iePageHtml = runtimeConfig; // await (await fetch("https://localhost:3000/prior/jump-if-ie.js")).text();
	// const iePageHtml = useRuntimeConfig().iePageHtml as string;
	return iePageHtml;
});
