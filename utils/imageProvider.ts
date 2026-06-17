/**
 * 判断图片 src 是否是可直接访问的完整地址（如火山引擎 TOS 返回的公开 URL、blob、data URI）。
 * 这类地址不应再经过 Cloudflare Images 提供商二次拼接处理。
 * @param src - 图片地址
 * @returns 是否是完整地址
 */
export function isFullImageUrl(src?: string): boolean {
	return !!src && /^(https?:|blob:|data:)/i.test(src);
}

/**
 * 根据图片 src 返回应使用的 Nuxt Image 提供商：
 * - 完整地址（TOS 公开 URL / blob / data）返回 `undefined`，让 NuxtImg 原样渲染、不走 Cloudflare 提供商；
 * - 其余（Cloudflare Images 的图片 ID）返回 Cloudflare 提供商。
 * @param src - 图片地址
 * @returns Nuxt Image 提供商名称，或 `undefined`
 */
export function getImageProvider(src?: string): string | undefined {
	return isFullImageUrl(src) ? undefined : environment.cloudflareImageProvider;
}
