type CompInstance = InstanceType<typeof Comp>;
/**
 * 指向 Comp DOM 的引用。
 * @param value - 初始化传递过来的数据。
 * @returns 指向 Comp DOM 的引用。
 */
export function refComp(value?: CompInstance) {
	return customRef((track, trigger) => ({
		get() {
			track();
			return value?.$el;
		},
		set(newValue) {
			value = newValue as unknown as CompInstance;
			trigger();
		},
	}));
}
