export { };

declare global {
	/**
	 * 从一个接口中筛选值为指定类型的子集接口。
	 * @template Source - 源接口。
	 * @template Condition - 筛选值的类型。
	 */
	type FilterValueType<Source, Condition> = Pick<
		Source,
		{
			[K in keyof Source]: Source[K] extends Condition ? K : never
		}[keyof Source]
	>;

	/**
	 * 移除只读修饰符。
	 * @template T - 源对象。
	 */
	type Writeable<T> = { -readonly [P in keyof T]: T[P] };

	/**
	 * 深层移除只读修饰符。
	 * @template T - 源对象。
	 */
	type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

	/**
	 * 类型去空。相当于 `!`。
	 *
	 * 与自带类型帮手 `NonNullable` 的功能实现不一致，结果可能略有不同。
	 * @template T - 可能带空的类型。
	 */
	type NonNull<T> = Exclude<T, undefined | null>;

	/**
	 * 重写某个对象部分字段的类型。
	 * @template T - 源对象。
	 * @template U - 重写后的字段及其类型。
	 */
	type Override<T, U> = Omit<T, keyof U> & U;
	
	/**
	 * 获取组件的 Props。
	 * @template T - Vue 组件。
	 */
	type ComponentProps<T> = InstanceType<T>["$props"];
	
	/**
	 * 去除 Ref 的类型。
	 * @template R - 可能为 Ref 的类型。
	 */
	type Unref<R> = R extends MaybeRefOrGetter<infer U> ? U : T;
}
