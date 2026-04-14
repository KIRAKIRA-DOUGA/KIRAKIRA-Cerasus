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
 * 将所有可枚举的自身属性从一个或多个源对象复制到目标对象。它返回修改后的目标对象。
 *
 * 相较于 `Object.assign`，当您键入源对象时，您将享受 TypeScript 从源对象获得的属性类型提示。此外，由于 TypeScript
 * 内置库的实现是将目标对象的类型与每个源对象的类型合并，事实上，我们只需要维护目标对象的原始类型。
 *
 * @param target - 要复制到的目标对象 — 将源属性应用于什么，在修改后返回。
 * @param sources - 从中复制属性的源对象 — 包含要应用的属性的对象。
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
 * @param startIndex - 初始值序号。默认为 0。
 * @returns 重复指定次数对象的数组。
 */
export function forMap<T>(length: number, callback: (index: number) => T, startIndex: number = 0) {
	return Array.from({ length }, (_, index) => callback(index + startIndex));
}

/**
 * 将 MaybeRef、Getter 或 ComputedRef 转换为独立的新 Ref。
 * @param existedRef - 存在的 MaybeRef、Getter 或 ComputedRef。
 * @returns 一个独立的新 Ref。
 */
export function toNewRef<T>(existedRef: MaybeRefOrGetter<T> | ComputedRef<T>) {
	return toRef(toValue(existedRef));
}

/**
 * Supplements the target object with properties from one or more source objects.
 * Only properties that do not already exist or the property values are undefined in the target object are added.
 * This function does not overwrite existing properties in the target.
 *
 * This function has the same function signature as `Object.assign`, but the operation is the opposite.
 *
 * @param target - The object to be supplemented.
 * @param sources - One or more source objects whose properties will be added to the target.
 * @returns The supplemented target object.
 *
 * @example
 * ```typescript
 * const bar = { a: true, c: true };
 * {
 *     const foo = { a: false, b: false };
 *     Object.assign(foo, bar);
 *     console.log(foo); // { a: true, b: false, c: true };
 * }
 * {
 *     const foo = { a: false, b: false };
 *     Object.supplement(foo, bar);
 *     console.log(foo); // { a: false, b: false, c: true };
 * }
 * ```
 */
export const supplement: typeof Object["assign"] = (target: object, ...sources: object[]) => {
	for (const source of sources)
		for (const [key, value] of Object.entries(source))
			if ((target as AnyObject)[key] === undefined)
				(target as AnyObject)[key] = value;
	return target;
};

/**
 * Asserts that the provided object is of the specified type.
 *
 * In fact, if used correctly, it can force the type of a variable to suddenly change to another type.
 *
 * @remarks Due to the limitations of TypeScript, it can only shrink the type.
 *
 * @template T - The type that the object should be.
 * @param object - The object to be asserted.
 *
 * @remarks This function is a no-op and does not perform any actual assertion. It is used to provide type safety and ensure that the object is of the specified type.
 *
 * @example
 * ```typescript
 * let foo = "foo"; // Type: string
 * asserts<"foo" | "bar">(foo);
 * foo; // Type: "foo" | "bar"
 *
 * let element = document.getElementById("my-element")!.firstElementChild!; // Type: Element
 * asserts<HTMLInputElement>(element);
 * element; // Type: HTMLInputElement
 *
 * let a = 123; // Type: number
 * asserts<string>(a);
 * a; // Type: never. Because type "number" is not assignable to type "string".
 *
 * let foo = "foo" as "foo" | "bar"; // Type: "foo" | "bar"
 * asserts<string>(foo);
 * foo; // Type is still "foo" | "bar", because it cannot increase the type.
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function asserts<T>(object: unknown): asserts object is T { }
