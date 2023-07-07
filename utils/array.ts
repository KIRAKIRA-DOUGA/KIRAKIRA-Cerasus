/*
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
	array.splice(0, Infinity);
}

/**
 * 将源数组清空后注入新的数据。
 * @param array - 源数组。
 * @param items - 新的数据。
 */
export function arrayInject<T>(array: T[], items: Iterable<T>): void {
	arrayClearAll(array);
	array.push(...items);
}

/**
 * 随机返回数组中的一个项目。
 * @param array - 数组。
 * @param record - 随机记录。如果提供，则在所有项目被随机抽取完毕之前不会抽取相同的项目。
 * @returns 数组其中的随机一个项目。
 */
export function randomOne<T>(array: T[], record?: MaybeRef<number[]>): T {
	if (!array.length) return null as T;
	record = toValue(record);
	let index = randBetween(0, array.length - 1);
	if (record !== undefined) {
		if (record.length !== array.length + 1 || record.every((n, i) => !i || n)) {
			let last = +record[0];
			if (!Number.isFinite(last)) last = -1;
			arrayInject(record, Array(array.length + 1).fill(0));
			record[0] = last;
		}
		while (record[index + 1] || index === record[0])
			index = randBetween(0, array.length - 1);
		record[index + 1] = 1;
		record[0] = index;
	}
	return array[index];
}

/**
 * 通过一个常量数组映射到一个对象。
 * @remarks 此 JSDoc 的 `@param` 部分参数后故意没加 “-”，否则会出现 bug。
 * @param array **常量**字符串数组。
 * @param callbackFn 生成作为对象的值。
 * @returns 映射的对象。
 */
export function arrayMapObject<const T extends string, U>(array: T[], callbackFn: (value: T, index: number, array: T[]) => U) {
	return Object.fromEntries(array.map((value, index, array) => ([value, callbackFn(value, index, array)] as [T, U]))) as Record<T, U>;
}
