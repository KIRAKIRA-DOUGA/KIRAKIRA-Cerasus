/**
 * 防抖
 * 防抖技术使得一个函数在特定的时间内没有再被调用后才执行。如果这个函数在等待期间又被调用，则等待时间将重新计算。这种技术通常用于搜索框输入。
 * @param func 函数
 * @param wait 等待时间，毫秒
 * @returns 防抖函数
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, wait: number): (...args: Parameters<F>) => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function (...args: Parameters<F>) {
		if (timeoutId !== null)
			clearTimeout(timeoutId);
    
		timeoutId = setTimeout(() => func(...args), wait);
	};
}
