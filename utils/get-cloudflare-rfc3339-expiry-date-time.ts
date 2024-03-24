/**
 * 生成符合 Cloudflare 风格的过期日期字符串，例如："2024-03-17T13:47:28Z"
 * @param expiresIn 有效期限，单位：秒。
 * @returns 符合 Cloudflare 风格的过期日期字符串
 */
export function getCloudflareRFC3339ExpiryDateTime(expiresIn: number): string {
	return (new Date((new Date()).getTime() + expiresIn * 1000)).toISOString().replace(/\.\d{3}/, "");
}
