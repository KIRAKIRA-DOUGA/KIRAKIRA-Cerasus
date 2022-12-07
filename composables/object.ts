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

/**
 * 将驼峰式字符串转换为连字符式字符串。
 * @param str - 驼峰式字符串。
 * @returns - 连字符式字符串。
 */
export const camelToKebabCase = (str: string) => str.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * 将连字符式字符串转换为驼峰式字符串。
 * @param str - 连字符式字符串。
 * @returns - 驼峰式字符串。
 */
export const kebabToCamelCase = (str: string) => str.toLowerCase().replace(/-(\w)/g, (_, w: string) => w.toUpperCase());

/**
 * 同自带的 `useCssModule` 引入 CSS 模块样式的类名，但是改成了驼峰式，方便表达式调用。
 * @param name - CSS 模块名称。
 * @returns CSS 模块样式类名映射。
 */
export function useCamelCssModule(name?: string) {
	const styles = useCssModule(name);
	for (const [className, moduleClassName] of Object.entries(styles))
		styles[kebabToCamelCase(className)] = moduleClassName;
	return styles;
}
