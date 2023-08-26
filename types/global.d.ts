export { };

/**
 * 现在声明进入全局命名空间的类型，或者增加全局命名空间中的现有声明。
 */
declare global {
	// type HtmlContext = Record<"body" | "bodyAppend" | "bodyAttrs" | "bodyPrepend" | "head" | "htmlAttrs", string[]>;

	/**
	 * 布尔型及其字符串形式。
	 */
	type Booleanish = boolean | "true" | "false";
	/**
	 * 数字及其字符串形式。
	 */
	type Numberish = number | string;
	/**
	 * 任何人类可直接读的类型，包括字符串、数字、大数。
	 */
	type Readable = string | number | bigint;
	/**
	 * 任何可作为 JavaScript 对象键名的类型，包括字符串、数字、符号。
	 */
	type ObjectKey = string | number | symbol;
	/**
	 * 听说你想绕过警告使用 any？
	 */
	type Any = Parameters<typeof alert>[0];
	/**
	 * 管它是啥反正是对象就是了。
	 */
	type AnyObject = Record<ObjectKey, Any>;
	/**
	 * 为什么 Record 还需要手动指定键的类型？多此一举。
	 * @template T - 值的类型。
	 */
	type RecordValue<T> = Record<ObjectKey, T>;
	/**
	 * 表示二维点的元组。
	 */
	type TwoD = [number, number];
	/**
	 * 表示三维点的元组。
	 */
	type ThreeD = [number, number, number];
	/**
	 * 表示四维点的元组。
	 */
	type FourD = [number, number, number, number];
	/**
	 * 指定类型或一个无参数函数返回为指定类型。
	 * @template T - 指定类型及无参数函数返回的这个类型。
	 */
	type TypeOrReturnToType<T> = T | (() => T);
	
	/**
	 * 使用 SCSS 中定义的变量的值。
	 */
	declare function useScssVariables(): Record<string, string> & { numbers: Record<string, string> };
	
	interface Window {
		/**
		 * 仅在 Internet Explorer 中可用的 ActiveX 对象，高版本浏览器则会返回 undefined。
		 */
		ActiveXObject: undefined;
	}
}
