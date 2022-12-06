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
