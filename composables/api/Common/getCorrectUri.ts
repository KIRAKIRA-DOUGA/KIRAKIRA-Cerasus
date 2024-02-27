/**
 * 根据当前环境（开发或生产）返回正确的后端地址
 * @returns 正确的后端地址。
 */
export default function getCorrectUri() {
	// URI 必须包含协议头，不建议在结尾添加斜线 '/'
	// eg. https://localhost:9999

	const isProduction = environment.production;
	const useLocalBackEnd = environment.useLocalBackEnd;

	if (isProduction) return "https://rosales.kirakira.moe"; // 生产环境，使用真实后端服务器
	else if (useLocalBackEnd) return "https://localhost:9999"; // 开发环境，且使用本地后端服务器
	else return "https://localhost:3000/api"; // DELETE 开发环境，直接使用真实后端服务器，在正式上线前删除。
}
