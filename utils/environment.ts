/**
 * 环境宏定义变量。
 */
export const environment = {
	/** 是否是服务端渲染？ */
	get server() { return import.meta.server; },
	/** 是否是客户端渲染？ */
	get client() { return import.meta.client; },
	/** 是否是生产环境下？ */
	get production() { return process.env.NODE_ENV === "production"; },
	/** 是否是开发环境下？ */
	get development() { return process.env.NODE_ENV === "development"; },
	/** 后端接口 URI 地址 */
	get backendUri() {
		const DEFAULT_BACKEND_URI = "https://localhost:30000/";
		try {
			const backendUriInput = import.meta.env.VITE_BACKEND_URI;
			if (!backendUriInput) {
				console.error("ERROR", "Server startup failed,  the value of the environment variable BACKEND_URL was not specified.");
				return DEFAULT_BACKEND_URI;
			}
			const backendUri = new URL(backendUriInput.trim());
			const backendUriHref = backendUri.href;
			if (!backendUriHref) {
				console.error("ERROR", "System startup failed, the parsed result of the environment variable BACKEND_URL is empty.");
				return DEFAULT_BACKEND_URI;
			}
			return backendUriHref;
		} catch (error) {
			console.error("ERROR", "System startup failed, environment variable BACKEND_URL parsing failed:", error);
			return DEFAULT_BACKEND_URI;
		}
	},
	/** cloudflare 的图片提供者的名字，生产环境时使用 cloudflare-prod，否则使用 cloudflare-stg */
	get cloudflareImageProvider() {
		const provider = import.meta.env.VITE_CLOUDFLARE_IMAGES_PROVIDER as string;
		if (!provider)
			console.error("ERROR", "Server startup failed,  the value of the environment variable CLOUDFLARE_IMAGES_PROVIDER was not specified.");
		if (provider === "cloudflare-prod" || provider === "cloudflare-stg")
			return provider;
		else
			return "cloudflare-stg";
	},
	/** 火山引擎 TOS 图片处理提供商的名字（对应 nuxt.config.ts image.providers.tos）。 */
	get tosImageProvider() {
		return "tos";
	},
	/** TOS 图片站点的公开基址（用于判断 src 是否为 TOS 图片，从而追加 x-tos-process 处理参数）。 */
	get tosImageBaseUrl() {
		const base = import.meta.env.VITE_TOS_IMAGE_BASE_URL as string;
		if (!base) {
			console.error("ERROR", "Server startup failed, the value of the environment variable VITE_TOS_IMAGE_BASE_URL was not specified.");
			return "";
		}
		return base.trim();
	},
	/** Cloudflare MPD 视频清单 URL 模板，其中 "{videoId}" 部分将会被替换为真实的视频 ID，生产和测试时使用不同的 URL */
	get cloudflareStreamVideoMpdUrlTemplate() {
		const DEFAULT_CLOUDFLARE_STREAM_SUBDOMAIN = "https://customer-o9xrvgnj5fidyfm4.cloudflarestream.com/";
		try {
			const subdomain = import.meta.env.VITE_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN;
			if (!subdomain) {
				console.error("ERROR", "Server startup failed,  the value of the environment variable BACKEND_URL was not specified.");
				return DEFAULT_CLOUDFLARE_STREAM_SUBDOMAIN;
			}
			const subdomainUri = new URL(subdomain);
			const subdomainUriHref = subdomainUri.href;
			if (!subdomainUriHref) {
				console.error("ERROR", "System startup failed, the parsed result of the environment variable BACKEND_URL is empty.");
				return DEFAULT_CLOUDFLARE_STREAM_SUBDOMAIN;
			}

			return `${subdomainUriHref}{videoId}/manifest/video.mpd`;
		} catch (error) {
			console.error("ERROR", "System startup failed, environment variable BACKEND_URL parsing failed:", error);
			return DEFAULT_CLOUDFLARE_STREAM_SUBDOMAIN;
		}
	},
};
