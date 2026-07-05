/**
 * 判断图片 src 是否是可直接访问的完整地址（如火山引擎 TOS 返回的公开 URL、blob、data URI）。
 * @param src - 图片地址
 * @returns 是否是完整地址
 */
export function isFullImageUrl(src?: string): boolean {
	return !!src && /^(https?:|blob:|data:)/i.test(src);
}

/** 解析后的 TOS 图片站点 host 缓存（`null` 表示未配置或非法），避免每张图渲染时重复解析基址、env 缺失时重复报错。 */
let cachedTosImageHost: string | null | undefined;

/**
 * 获取 TOS 图片站点的 host（懒解析并缓存）。
 * @returns TOS 图片站点 host，未配置或非法时返回 `null`
 */
function getTosImageHost(): string | null {
	if (cachedTosImageHost === undefined)
		try {
			const base = environment.tosImageBaseUrl;
			cachedTosImageHost = base ? new URL(base).host : null;
		} catch {
			cachedTosImageHost = null;
		}
	return cachedTosImageHost;
}

/**
 * 判断图片 src 是否是火山引擎 TOS 的图片地址（host 与配置的 TOS 图片站点一致）。
 * 这类地址需走 TOS 提供商，按请求宽度映射到预生成的多分辨率变体。
 * @param src - 图片地址
 * @returns 是否是 TOS 图片地址
 */
export function isTosImageUrl(src?: string): boolean {
	if (!src || !/^https?:/i.test(src)) return false;
	const host = getTosImageHost();
	if (!host) return false;
	try {
		return new URL(src).host === host;
	} catch {
		return false;
	}
}

/** TOS 上传对象名（key）的前缀，用于把裸对象名和旧的 Cloudflare 图片 ID 区分开。与后端上传命名保持一致。 */
const TOS_IMAGE_KEY_PREFIXES = ["avatar-", "video-cover-", "feed-group-cover-"];

/**
 * 判断图片 src 是否是火山引擎 TOS 的对象名（key，非完整 URL）。
 * 数据库现在只存对象名，前端据此拼出完整 URL 并选择预生成的变体档位。
 * @param src - 图片地址
 * @returns 是否是 TOS 对象名
 */
export function isTosImageKey(src?: string): boolean {
	return !!src && !isFullImageUrl(src) && TOS_IMAGE_KEY_PREFIXES.some(prefix => src.startsWith(prefix));
}

/**
 * 根据图片 src 返回应使用的 Nuxt Image 提供商：
 * - `blob:` / `data:` 及其它外链 → `undefined`，让 NuxtImg 原样渲染；
 * - TOS 对象名（key，数据库新存法）或 TOS 完整 URL（旧数据） → TOS 提供商（映射到预生成的多分辨率变体）；
 * - 裸图片 ID（旧 Cloudflare Images） → Cloudflare 提供商。
 * @param src - 图片地址
 * @returns Nuxt Image 提供商名称，或 `undefined`
 */
export function getImageProvider(src?: string): string | undefined {
	if (!src) return environment.cloudflareImageProvider;
	if (/^(blob:|data:)/i.test(src)) return undefined;
	if (isTosImageUrl(src)) return environment.tosImageProvider; // 旧数据：TOS 完整 URL
	if (/^https?:/i.test(src)) return undefined; // 其它外链原样渲染
	if (isTosImageKey(src)) return getTosImageHost() ? environment.tosImageProvider : undefined; // 新数据：TOS 对象名；基址未配置或非法时无法拼出完整地址，降级为 undefined 以免 tos provider 用空基址拼出相对路径静默 404（getTosImageHost 内部保证只报错一次）
	return environment.cloudflareImageProvider; // 裸 Cloudflare 图片 ID（旧数据 / 默认封面）
}
