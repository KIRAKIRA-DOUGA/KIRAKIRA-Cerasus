/**
 * 获取从指定元素节点，一直追溯到根元素的数组。
 * 用于查找事件目标并向上冒泡，找到需要的元素。
 * @param target - HTML DOM 节点。
 * @returns 从指定元素节点，一直追溯到根元素的数组。
 */
export function getPath(target: Node | Element | null): Element[] {
	if (!(target instanceof Element)) return [];
	const path: Element[] = [];
	while (target instanceof Element) {
		path.push(target);
		target = target.parentElement;
	}
	return path;
}

/**
 * 能同时监听多个事件，相当于多次重复调用 `addEventListener` 使用相同的回调函数但不同的事件类型。
 * @param element - HTML DOM 元素。
 * @param listener - 监听事件回调函数。
 * @param types - 监听事件数组。
 */
export function addEventListeners<K extends keyof WindowEventMap>(element: Window, listener: (this: Window, ev: WindowEventMap[K]) => void, ...types: K[]): void;
export function addEventListeners<K extends keyof DocumentEventMap>(element: Document, listener: (this: Document, ev: DocumentEventMap[K]) => void, ...types: K[]): void;
export function addEventListeners<K extends keyof HTMLElementEventMap, E extends HTMLElement>(element: E, listener: (this: E, ev: HTMLElementEventMap[K]) => void, ...types: K[]): void {
	// @ts-ignore
	types.forEach(type => element.addEventListener(type, listener));
}
