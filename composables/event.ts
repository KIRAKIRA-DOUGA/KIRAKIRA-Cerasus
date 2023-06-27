type Options = Partial<{
	/** 是否立即调用？ */
	immediate: boolean;
}>;

/**
 * 我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中。
 * @param target - 窗体对象，注意必须是字符串。
 * @param event - 事件。
 * @param callback - 回调函数。
 * @param options - 其它选项。
 */
export function useEventListener<K extends keyof WindowEventMap>(target: "window", event: K, callback: (this: Window, ev: WindowEventMap[K]) => void, options?: Options): void;
/**
 * 我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中。
 * @param target - 文档对象，注意必须是字符串。
 * @param event - 事件。
 * @param callback - 回调函数。
 * @param options - 其它选项。
 */
export function useEventListener<K extends keyof DocumentEventMap>(target: "document", event: K, callback: (this: Document, ev: DocumentEventMap[K]) => void, options?: Options): void;
/**
 * 我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中。
 * @param target - HTML DOM 元素。
 * @param event - 事件。
 * @param callback - 回调函数。
 * @param options - 其它选项。
 */
export function useEventListener<K extends keyof HTMLElementEventMap, E extends HTMLElement>(target: MaybeRef<E | ComponentPublicInstance | undefined>, event: K, callback: (this: E, ev: HTMLElementEventMap[K]) => void, options?: Options): void;
/**
 * 我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中。
 * @param target - HTML DOM 元素。
 * @param event - 事件。
 * @param callback - 回调函数。
 * @param options - 其它选项。
 */
export function useEventListener<K extends keyof HTMLElementEventMap, E extends HTMLElement>(target: MaybeRef<E | ComponentPublicInstance | undefined> | "window" | "document", event: K, callback: (this: E, ev: HTMLElementEventMap[K]) => void, options: Options = {}): void {
	// 如果你想的话，也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素。
	const getTarget = () => {
		target = toValue(target);
		if (!target) return undefined;
		else if (target === "window") return globalThis.window;
		else if (target === "document") return globalThis.document;
		else if ("$el" in target) return target.$el as HTMLElement;
		else return target;
	};
	onMounted(() => {
		if (options.immediate) (callback as () => void)();
		getTarget()?.addEventListener(event, callback as never);
	});
	onUnmounted(() => {
		getTarget()?.removeEventListener(event, callback as never);
	});
}
