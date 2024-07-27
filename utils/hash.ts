/**
 * 使用 crypto 异步生成一个不加盐的十六进制 SHA-256 Hash。
 * @param input - 原字符串。
 * @returns Hash 结果。
 */
export async function generateHash(input: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);

	// 使用 SHA-256 算法生成哈希 // NOTE 只能在安全上下文中使用，例如：HTTPS, localhost, Web/Service Workers 或 浏览器扩展 等
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// 将哈希值转换为 64 个字符的十六进制字符串
	return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
