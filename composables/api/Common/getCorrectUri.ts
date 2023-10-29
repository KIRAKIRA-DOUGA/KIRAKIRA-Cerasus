/**
 * 根据当前环境（开发或生产）确定正确的后端地址。
 * @returns 正确的后端地址。
 */
export default function getCorrectUri() {
	return environment.production ? "https://rosales.kirakira.moe" : "https://localhost:9999";
}
