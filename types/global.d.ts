export { };

/**
 * 现在声明进入全局命名空间的类型，或者增加全局命名空间中的现有声明。
 */
declare global {
	// type HtmlContext = Record<"body" | "bodyAppend" | "bodyAttrs" | "bodyPrepend" | "head" | "htmlAttrs", string[]>;

	/**
	 * 布尔型及其字符串形式。
	 */
	type Booleanish = boolean | BooleanString;
	/**
	 * 布尔型的字符串形式。
	 */
	type BooleanString = "true" | "false";
	/**
	 * 数字及其字符串形式。
	 */
	type Numberish = number | string;
	/**
	 * 任何人类可直接读的类型，包括字符串、数字、大数。
	 */
	type Readable = string | number | bigint;
	/**
	 * 听说你想绕过警告使用 any？
	 */
	type Any = Parameters<typeof alert>[0];
	/**
	 * 管它是啥反正是对象就是了。
	 */
	type AnyObject = Record<PropertyKey, Any>;
	/**
	 * 为什么 Record 还需要手动指定键的类型？多此一举。
	 * @template T - 值的类型。
	 */
	type RecordValue<T> = Record<PropertyKey, T>;
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
	 * 此对象在内部创建，并从 `setTimeout()` 和 `setInterval()` 返回。它可以传递给 `clearTimeout()` 或 `clearInterval()`，以便取消计划的操作。
	 *
	 * 默认情况下，当使用 `setTimeout()` 或 `setInterval()` 调度计时器时，只要计时器处于活动状态，Node.js 事件循环就会继续运行。这些函数返回的每个 `Timeout` 对象都导出 `timeout.ref()` 和 `timeout.unref()` 函数，它们可用于控制此默认行为。
	 */
	interface Timeout extends NodeJS.Timeout { }
	/**
	 * SCSS 中定义的变量的值。其中的 numbers 属性表示已转换为数字类型的值。
	 */
	interface IScssVariables extends DeepReadonly<Record<string, string> & { numbers: Record<string, number> }> { }
	/**
	 * 使用 SCSS 中定义的变量的值。其中的 numbers 属性表示已转换为数字类型的值。
	 */
	declare function useScssVariables(): IScssVariables;
	interface Window {
		/**
		 * 仅在 Internet Explorer 中可用的 ActiveX 对象，高版本浏览器则会返回 undefined。
		 */
		ActiveXObject: undefined;
	}
	interface Document {
		/**
		 * 在 Internet Explorer 中可用的文本选中对象。
		 *
		 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/getSelection)
		 */
		selection: Selection | null;
	}
	interface ScreenOrientation {
		/**
		 * `ScreenOrientation` 接口的 `lock()` 属性将包含文档的方向锁定为指定的方向。
		 *
		 * 堂堂 VSCode 把这个定义给删了。
		 *
		 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/ScreenOrientation/lock)
		 */
		lock(type: "any" | "natural" | "landscape" | "portrait" | OrientationType): Promise<void>;
	}
}
