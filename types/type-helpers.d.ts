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
	type ComponentProps<T> = Omit<InstanceType<T>["$props"], keyof VNodeProps>;

	/**
	 * 去除 Ref 的类型。
	 * @template R - 可能为 Ref 的类型。
	 */
	type Unref<R> = R extends MaybeRefOrGetter<infer U> ? U : T;

	/**
	 * 删除 T 的索引签名，只使用已知的属性键名。例如从枚举类型中删除 `[x: string]`。
	 * @template T - 源对象。
	 */
	type KnownKeys<T> = keyof {
		[K in keyof T]:
			string extends K ? never :
			number extends K ? never :
			symbol extends K ? never :
			K
	};

	/**
	 * 将对象的所有键大驼峰化。
	 * @template T - 源对象。
	 */
	type CapitalizeObject<T extends object> = {
		[key in keyof T as Capitalize<key>]:
			T[key] extends (infer U)[] | undefined | null ? CapitalizeObject<U>[] :
			CapitalizeObject<T[key]>;
	} & T;

	/**
	 * 类似 `keyof` 关键字，只不过返回的是值的类型集合而不是键的类型集合。
	 * @template T - 源对象。
	 */
	type ValueOf<T extends object> =
		T extends ArrayLike<infer Value> ? Value :
		T extends Iterable<infer Value> ? Value :
		T[keyof T];

	/**
	 * 深度只读对象。
	 * @template T - 源对象。
	 */
	type DeepReadonly<T> = Readonly<{
		[key in keyof T]: DeepReadonly<T[key]>;
	}>;

	/**
	 * 可能是承诺也可能是它自己。
	 *
	 * @template T - 可能是承诺的类型。
	 */
	type MaybePromise<T> = T | Promise<T>;
}
