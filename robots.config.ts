type Req = Request & { headers: { host: string } };

export default [
	{ UserAgent: "*" },
	{ Disallow: "/admin/" },
	{ BlankLine: true },
	{ Comment: "Comment here" },
	// Be aware that this will NOT work on target: "static" mode.
	{ Sitemap: (req: Req) => `https://${req.headers.host}/sitemap.xml` },
];
