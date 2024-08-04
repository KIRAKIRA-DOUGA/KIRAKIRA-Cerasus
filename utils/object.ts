/**
 * 返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 `for...in` 循环遍历该对象时返回的顺序一致
 * （区别在于 for-in 循环还会枚举原型链中的属性）。
 *
 * 相较于 `Object.entries`，返回的值的类型不会那么恶心。
 * @template K - 对象的键名枚举类型。
 * @template V - 对象的值类型。
 * @param obj - 可以返回其可枚举属性的键值对的对象。
 * @returns 给定对象自身可枚举属性的键值对数组。
 */
export function entries<K extends string | number | symbol, V>(obj: { [s in K]?: V }) {
	return Object.entries(obj) as [K, V][];
}

/**
 * 返回一个由给定对象自身的可枚举的字符串键属性名组成的数组。
 *
 * 相较于 `Object.keys`，返回的值的类型不会那么恶心。
 * @param obj - 一个对象。
 * @returns 一个由给定对象自身可枚举的字符串键属性键组成的数组。
 */
export function keys<K extends object>(obj: K) {
	return Object.keys(obj) as (keyof K)[];
}

/**
 * 将所有可枚举自身属性的值从一个或多个源对象复制到目标对象。
 *
 * 相较于 `Object.assign`，输入的值的类型不会那么恶心。
 * @param target — 要复制到的目标对象。
 * @param source — 从中复制属性的源对象。
 * @returns 返回目标对象。
 */
export function assign<T extends object>(target: T, ...sources: Partial<T>[]): T {
	return Object.assign(target, ...sources);
}

/**
 * 创建一个重复指定次数对象的数组，用于循环创建组件。
 * 但是只需关心循环次数，不关心数组的内容。
 * @template T - 要重复的对象类型。
 * @param length - 循环次数。
 * @param callback - map 回调函数。
 * @param startIndex - 初始值序号。
 * @returns 重复指定次数对象的数组。
 */
export function forMap<T>(length: number, callback: (index: number) => T, startIndex: number = 0) {
	return Array<void>(length).fill(undefined).map((_, index) => callback(index + startIndex));
}

/**
 * 将 MaybeRef、Getter 或 ComputedRef 转换为独立的新 Ref。
 * @param existedRef — 存在的 MaybeRef、Getter 或 ComputedRef。
 * @returns 一个独立的新 Ref。
 */
export function toNewRef<T>(existedRef: MaybeRefOrGetter<T> | ComputedRef<T>) {
	return toRef(toValue(existedRef));
}
