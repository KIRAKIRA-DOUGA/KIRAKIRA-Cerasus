export { };

declare global {
	/**
	 * 从一个接口中筛选值为指定类型的真子集接口。
	 */
	type FilterValueType<Source, Condition> = Pick<
		Source,
		{
			[K in keyof Source]: Source[K] extends Condition ? K : never
		}[keyof Source]
	>;
}
