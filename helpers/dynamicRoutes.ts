/**
 * since we can't use imports here we just fetch
 * all our routes from a custom API endpoint where we can use imports
 */
export default async () => {
	return await $fetch("/api/sitemap-routes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
	});
};
