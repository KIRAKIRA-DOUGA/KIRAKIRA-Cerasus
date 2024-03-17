type TargetType = Node | Element | Ref<Element | null | undefined> | Event | EventTarget | null | undefined;
type DetectInPathType = Element | Ref<Element | null | undefined> | EventTarget | string | null | undefined;

/**
 * 获取从指定元素节点，一直追溯到根元素的数组。
 * 用于查找事件目标并向上冒泡，找到需要的元素。
 * @param target - HTML DOM 节点。
 * @returns 从指定元素节点，一直追溯到根元素的数组。
 */
export function getPath(target: TargetType): Element[] {
	if (isRef(target)) target = toValue(target);
	if (target instanceof Event) target = target.target;
	if (!(target instanceof Element)) return [];
	const path: Element[] = [];
	while (target instanceof Element) {
		path.push(target);
		target = target.parentElement;
	}
	return path;
}

/**
 * 根据鼠标事件的目标节点，查找要查询的元素是否是或是其祖先节点。比如查找元素是否被点击等。
 * @param target - 点击事件中的目标 HTML DOM 节点。
 * @param element - 要查找的冒泡 HTML DOM 节点。如果为字符串则表示要查询的类名。
 * @returns 要查询的元素是或是其祖先节点。
 */
export function isInPath(target: TargetType, element: DetectInPathType): boolean {
	const path = getPath(target);
	if (isRef(element)) element = toValue(element);
	if (typeof element === "string") {
		for (const el of path)
			if (el.classList.contains(element))
				return true;
		return false;
	}
	if (!(element instanceof Element)) return false;
	return path.includes(element);
}

/**
 * 能同时监听多个事件，相当于多次重复调用 `addEventListener` 使用相同的回调函数但不同的事件类型。
 * @template K - 窗体事件枚举类型。
 * @param element - 窗体对象。
 * @param listener - 监听事件回调函数。
 * @param types - 监听事件数组。
 */
export function addEventListeners<K extends keyof WindowEventMap>(...args: [element: Window, ...types: K[], listener: (this: Window, ev: WindowEventMap[K]) => void]): void;
/**
 * 能同时监听多个事件，相当于多次重复调用 `addEventListener` 使用相同的回调函数但不同的事件类型。
 * @template K - 文档事件枚举类型。
 * @param element - 文档对象。
 * @param listener - 监听事件回调函数。
 * @param types - 监听事件数组。
 */
export function addEventListeners<K extends keyof DocumentEventMap>(...args: [element: Document, ...types: K[], listener: (this: Document, ev: DocumentEventMap[K]) => void]): void;
/**
 * 能同时监听多个事件，相当于多次重复调用 `addEventListener` 使用相同的回调函数但不同的事件类型。
 * @template K - HTML DOM 元素事件枚举类型。
 * @template E - HTML DOM 元素类型。
 * @param element - HTML DOM 元素。
 * @param listener - 监听事件回调函数。
 * @param types - 监听事件数组。
 */
export function addEventListeners<K extends keyof HTMLElementEventMap, E extends HTMLElement>(...args: [element: E, ...types: K[], listener: (this: E, ev: HTMLElementEventMap[K]) => void]): void;
/**
 * 能同时监听多个事件，相当于多次重复调用 `addEventListener` 使用相同的回调函数但不同的事件类型。
 * @template K - HTML DOM 元素事件枚举类型。
 * @template E - HTML DOM 元素类型。
 * @param element - HTML DOM 元素。
 * @param listener - 监听事件回调函数。
 * @param types - 监听事件数组。
 */
export function addEventListeners<K extends keyof HTMLElementEventMap, E extends HTMLElement>(...args: [element: E, ...types: K[], listener: (this: E, ev: HTMLElementEventMap[K]) => void]): void {
	const element = args[0];
	const listener = args.at(-1) as Parameters<typeof addEventListeners>[1];
	const types = args.slice(1, -1) as K[];
	types.forEach(type => element.addEventListener(type, listener as never));
}

/**
 * 同时阻止事件冒泡和默认方法。
 * @param event - 事件。
 */
export function stopEvent(event: Event) {
	event.preventDefault();
	event.stopPropagation();
}

/**
 * 阻止键盘按下事件冒泡除非指定的按键。
 * @param event - 键盘按下事件。
 * @param keyCodes - 按键名称 `event.code`。
 */
export function stopPropagationExceptKey(event: KeyboardEvent, ...keyCodes: string[]) {
	const code = event.code.toLowerCase();
	for (let keyCode of keyCodes) {
		keyCode = keyCode.toLowerCase();
		if (keyCode.includes("ctrl") !== event.ctrlKey) continue;
		if (keyCode.includes("meta") !== event.metaKey) continue;
		if (keyCode.includes("alt") !== event.altKey) continue;
		if (keyCode.includes("shift") !== event.shiftKey) continue;
		keyCode = keyCode.replaceAll(/ctrl|meta|alt|shift|[\s+]/gi, "");
		if (code === keyCode) return;
	}
	event.stopPropagation();
}

/**
 * 控制元素的 display 是否为 none，来决定其是否可见。
 *
 * 该函数强制操作 DOM，不受 Vue 控制，用以解决某些 Vue 虚拟 DOM 和真实 DOM 数值不一致的问题。
 * @param element - HTML DOM 元素。
 * @param visible - 是否可见。
 */
export function setDisplayVisible(element: HTMLElement | undefined, visible: boolean) {
	if (!element || typeof visible !== "boolean") return;
	if (!visible) element.style.display = "none";
	else element.style.removeProperty("display");
}

/**
 * 手动销毁元素，和阴魂不散说拜拜。
 * @param element - 销毁的元素 ref。
 */
export function kill(element: MaybeRef<Element | undefined | null>) {
	if (isRef(element)) {
		element.value?.remove();
		element.value = null;
	} else
		element?.remove();
}

/**
 * 获取 HTML DOM 元素的序号。
 * @param element - HTML DOM 元素。
 * @returns - 元素的序号。
 */
export function elementIndex(element: MaybeRef<Element | undefined | null>) {
	element = toValue(element);
	if (!element) return -1;
	if (!element.parentNode) return -1;
	if (!element.parentElement) return 0;
	return [...element.parentElement.children].indexOf(element);
}

/**
 * 清除 `<input type="file">` 的选中内容状态。
 * @param file - `<input type="file">`
 */
export function clearFileInput(file: MaybeRef<HTMLInputElement | undefined | null>) {
	file = toValue(file);
	if (file) file.value = null! as string;
}

/**
 * 通过布尔值控制元素的某个样式类名是否使能。
 * @param element - HTML DOM 元素。
 * @param className - 样式类名。
 * @param enabled - 是否是能？
 */
export function setClassEnabled(element: MaybeRef<Element | undefined | null>, className: string, enabled: boolean) {
	element = toValue(element);
	if (!element) return;
	element.classList[enabled ? "add" : "remove"](className);
}
