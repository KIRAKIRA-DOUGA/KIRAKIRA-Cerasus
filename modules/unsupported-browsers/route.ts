import { defineEventHandler, setHeader } from "h3";
import { useRuntimeConfig } from "#imports";

export default defineEventHandler(e => {
	setHeader(e, "Content-Type", "text/html");
	if (!process.dev)
		setHeader(e, "Cache-Control", "max-age=600, must-revalidate");

	const iePageHtml = useRuntimeConfig().iePageHtml as string;
	return iePageHtml;
});
