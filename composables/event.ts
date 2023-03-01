export function useEventListener<K extends keyof WindowEventMap>(target: Window, event: K, callback: (this: Window, ev: WindowEventMap[K]) => void): void;
export function useEventListener<K extends keyof DocumentEventMap>(target: Document, event: K, callback: (this: Document, ev: DocumentEventMap[K]) => void): void;
/**
 * 我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中。
 * @param target - HTML DOM 元素。
 * @param event - 事件。
 * @param callback - 回调函数。
 */
export function useEventListener<K extends keyof HTMLElementEventMap, E extends HTMLElement>(target: E, event: K, callback: (this: E, ev: HTMLElementEventMap[K]) => void): void {
	// 如果你想的话，
	// 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素。
	onMounted(() => target.addEventListener(event, callback as never));
	onUnmounted(() => target.removeEventListener(event, callback as never));
}
