/*!
 * JS Array 又不自带删除方法，想用 prototype 扩展语法，问题是又不推荐使用。
 */

/**
 * 删除数组指定索引值的项目。
 * @param array - 数组。
 * @param index - 索引值。
 */
export function arrayRemoveAt<T>(array: T[], index: number): void {
	array.splice(index, 1);
}

/**
 * 删除数组的指定项目，如有多个重复项目只删除第一个。
 * @param array - 数组。
 * @param item - 项目。
 * @returns 是否成功删除。
 */
export function arrayRemoveItem<T>(array: T[], item: T): boolean {
	const index = array.indexOf(item);
	if (index === -1) return false;
	array.splice(index, 1);
	return true;
}

/**
 * 清空数组。
 * @param array - 数组。
 */
export function arrayClearAll<T>(array: T[]): void {
	array.splice(0, array.length);
}

/**
 * 随机返回数组中的一个项目。
 * @param array - 数组。
 * @returns 数组其中的随机一个项目。
 */
export function randomOne<T>(array: T[]): T {
	return array.length ? array[randBetween(0, array.length - 1)] : null as T;
}
