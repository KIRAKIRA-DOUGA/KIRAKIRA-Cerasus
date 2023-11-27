/**
 * 根据当前环境（开发或生产）返回正确的后端地址。
 * @returns 正确的后端地址。
 */
export default function getCorrectUri() {
	// URI 必须包含协议头，不建议在结尾添加斜线 '/'
	// eg. https://localhost:9999
	return environment.production ? "https://rosales.kirakira.moe" : "https://localhost:9999";
}
