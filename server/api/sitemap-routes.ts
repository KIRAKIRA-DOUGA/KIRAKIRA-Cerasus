import { apiPlugin } from "@storyblok/vue";
import { eventHandler } from "h3";

/**
 * We are using Storyblok as our CMS,
 * in order to have all news and testimonials pages in our sitemap
 * we need to fetch some from Storyblok
 */
export default eventHandler(async event => {
	const { req, res } = event;
	if (req.method !== "POST") {
		res.statusCode = 405;
		res.end();
		return;
	}
	const config = useRuntimeConfig();
	const { storyblokApi } = apiPlugin({ apiOptions: config.public.storyblok });
	console.log("[vue-sitemap] generate dynamic routes");

	const fetchRoutes = async (slug: string) => {
		const routes = [];
		const pageInfo = await storyblokApi.get(`cdn/stories/?starts_with=${slug}`, {
			version: "published",
			per_page: 1,
			page: 1,
		});

		const totalPages = Math.ceil(pageInfo.headers.total / 25);
		for (let page = 1; page <= totalPages; page++) {
			const pageNews = await storyblokApi.get(`cdn/stories/?starts_with=${slug}`, {
				version: "published",
				page,
			});

			for (const news of pageNews.data.stories)
				routes.push(`/${slug}/${news.slug}`);

			routes.push(`/${slug}/${page}`);
		}
		return routes;
	};

	return [...(await fetchRoutes("news")), ...(await fetchRoutes("testimonials"))];
});
