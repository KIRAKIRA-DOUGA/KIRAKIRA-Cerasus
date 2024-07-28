/**
 * 没错，就是大名鼎鼎的延迟函数。\
 * 这将异步执行，不会阻塞线程。
 * @param ms - 毫秒值。
 * @returns 空返回值。
 */
export function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const isb = new Int32Array(typeof SharedArrayBuffer !== "undefined" ? new SharedArrayBuffer(4) : 1 as unknown as ArrayBufferLike);
/**
 * 睡眠函数。\
 * 这将会阻塞线程。
 * @param ms - 毫秒值。
 */
export function sleep(ms: number) {
	Atomics.wait(isb, 0, 0, ms);
}

/**
 * 计划每延迟几毫秒重复执行一次回调。
 * @param callback - 计时器超时时要调用的回调函数。
 * @param ms - 调用回调函数之前等待的毫秒数。
 * @returns 用于取消计时器的 ID 引用。
 */
export function createInterval(callback: () => void, ms: number) {
	const timeoutId = ref<Timeout>();
	onMounted(() => {
		timeoutId.value = setInterval(callback, ms);
	});
	onUnmounted(() => {
		clearInterval(timeoutId.value);
	});
	return timeoutId;
}
