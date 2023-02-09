/**
 * 没错，就是大名鼎鼎的延迟函数。
 * 叫 sleep 也行。
 * @param ms - 毫秒值。
 * @returns 空返回值。
 */
export default function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}
