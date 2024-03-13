/**
 * 判断一个 URL 是否指向一个本地静态资产
 * @param url 资产 URL
 * @returns URL 是否指向一个本地静态资产
 */
export function isLocalStaticAssetUrl(url: string): boolean {
	const staticAssetUrlStartWith = "/static/images";
	return url.startsWith(staticAssetUrlStartWith);
}
