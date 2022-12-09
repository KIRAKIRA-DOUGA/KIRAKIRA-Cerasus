/**
 * 返回一个给定对象自身可枚举属性的键值对数组，其排列与使用 `for...in` 循环遍历该对象时返回的顺序一致
 * （区别在于 for-in 循环还会枚举原型链中的属性）。
 * 相较于 `Object.entries`，返回的值的类型不会那么恶心。
 * @param obj - 可以返回其可枚举属性的键值对的对象。
 * @returns 给定对象自身可枚举属性的键值对数组。
 */
export function entries<K extends string | number | symbol, V>(obj: { [s in K]?: V }) {
	return Object.entries(obj) as [K, V][];
}
