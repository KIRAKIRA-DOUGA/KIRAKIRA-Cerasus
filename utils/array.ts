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
 * @param items - 项目。
 * @returns 成功删除的个数。
 */
export function arrayRemoveItem<T>(array: T[], ...items: T[]): number {
	let successes = 0;
	for (const item of items) {
		const index = array.indexOf(item);
		if (index === -1) continue;
		array.splice(index, 1);
		successes++;
	}
	return successes;
}

/**
 * 删除数组的所有指定项目。
 * @param array - 数组。
 * @param items - 项目。
 * @returns 成功删除的个数。
 */
export function arrayRemoveAllItem<T>(array: T[], ...items: T[]) {
	let successes = 0;
	for (let i = array.length - 1; i >= 0; i--)
		if (items.includes(array[i])) {
			array.splice(i, 1);
			successes++;
		}
	return successes;
}

/**
 * 仅在数组不包含该项目时，在数组末尾追加该项目。
 * @param array - 数组。
 * @param items - 项目。
 */
export function arrayPushUniquely<T>(array: T[], ...items: T[]) {
	for (const item of items)
		if (!array.includes(item))
			array.push(item);
}

/**
 * 清空数组。
 * @param array - 数组。
 */
export function arrayClearAll<T>(array: T[]): void {
	array.splice(0, Infinity);
}

/**
 * 将源数组清空后重新注入新的数据。
 * @param array - 源数组。
 * @param items - 新的数据。
 */
export function arrayRelist<T>(array: T[], items: Iterable<T>): void {
	array.splice(0, Infinity, ...items);
}

/**
 * 切换数组是否包含项目。如果数组包含该项目则移除，反之则添加。
 * @param array - 数组。
 * @param item - 项目。
 * @param force - 包括后，将切换变成仅单向操作。如果设置为 false，则只会删除项目，但不会添加。如果设置为 true，则只会添加项目，但不会删除。
 */
export function arrayToggle<T>(array: T[], item: T, force?: boolean): void {
	const index = array.indexOf(item);
	if (index === -1 || force)
		array.push(item);
	else
		arrayRemoveAt(array, index);
}

/**
 * 随机返回数组中的一个项目。
 * @param array - 数组。
 * @param record - 随机记录。如果提供，则在所有项目被随机抽取完毕之前不会抽取相同的项目。
 * @returns 数组其中的随机一个项目。
 */
export function randomOne<T>(array: T[], record?: MaybeRef<number[]>): T {
	if (array.length === 0) return null as T;
	record = toValue(record);
	let index = randBetween(0, array.length - 1);
	if (record !== undefined) {
		if (record.length !== array.length + 1 || record.every((n, i) => !i || n)) {
			let last = +record[0];
			if (!Number.isFinite(last)) last = -1;
			arrayRelist(record, Array(array.length + 1).fill(0));
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
 * @param array - **常量**字符串数组。
 * @param callbackFn - 生成作为对象的值。
 * @returns 映射的对象。
 */
export function arrayMapObjectConst<const T extends string, U>(array: readonly T[], callbackFn: (value: T, index: number, array: readonly T[]) => U) {
	return Object.fromEntries(array.map((value, index, array) => ([value, callbackFn(value, index, array)] as [T, U]))) as Record<T, U>;
}

/**
 * 通过一个任意数组映射到一个对象。
 * @param array - 任意数组。
 * @param callbackFn - 生成作为对象的键值对元组。
 * @returns 映射的对象。
 */
export function arrayMapObject<T, K extends PropertyKey, U>(array: T[], callbackFn: (value: T, index: number, array: T[]) => [K, U]) {
	return Object.fromEntries(array.map((value, index, array) => callbackFn(value, index, array))) as Record<K, U>;
}

/**
 * 数组去重。
 * @param array - 数组。
 * @returns 注意是会返回一个新的数组。
 */
export function arrayToRemoveDuplicates<T>(array: T[]) {
	return [...new Set(array)];
}
