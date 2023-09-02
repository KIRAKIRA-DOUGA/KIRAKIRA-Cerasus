/**
 * 没错，就是大名鼎鼎的延迟函数。
 * 叫 sleep 也行。
 * @param ms - 毫秒值。
 * @returns 空返回值。
 */
export function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 计划每延迟几毫秒重复执行一次回调。
 * @param callback - 计时器超时时要调用的回调函数。
 * @param ms 调用回调函数之前等待的毫秒数。
 * @returns 用于取消计时器的 ID 引用。
 */
export function createInterval(callback: () => void, ms: number) {
	const timeoueId = ref<Timeout>();
	onMounted(() => {
		timeoueId.value = setInterval(callback, ms);
	});
	onUnmounted(() => {
		clearInterval(timeoueId.value);
	});
	return timeoueId;
}
