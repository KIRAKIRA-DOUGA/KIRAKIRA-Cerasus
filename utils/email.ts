/**
 * 验证 Email 地址是否不合法
 * @param email - 被验证的 Email 地址
 * @returns 验证结果，不合法返回 true，否则返回 false
 */
export function isInvalidEmail(email: string): boolean {
	return !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]{2,}$/);
}
