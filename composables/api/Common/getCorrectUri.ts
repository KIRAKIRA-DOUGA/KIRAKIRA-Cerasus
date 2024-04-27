/**
 * 根据当前环境（开发或生产）返回正确的后端地址
 * @returns 正确的后端地址。
 */
export default function getCorrectUri() {
	// URI 必须包含协议头，不建议在结尾添加斜线 '/'
	// eg. https://localhost:9999

	const { production, localBackend } = environment;

	return production ? "https://rosales.kirakira.moe" : // 生产环境，使用真实后端服务器。
		localBackend ? "https://localhost:9999" : // 开发环境，且使用本地后端服务器。
		"https://localhost:3000/api"; // 开发环境，直接代理使用真实后端服务器。
}
