export { };

declare global {
	/**
	 * 从一个接口中筛选值为指定类型的真子集接口。
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
}
