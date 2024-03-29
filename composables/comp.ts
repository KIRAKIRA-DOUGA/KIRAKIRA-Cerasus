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
			return value?.$el as HTMLElement | undefined;
		},
		set(newValue) {
			value = newValue as unknown as CompInstance;
			trigger();
		},
	}));
}

/**
 * 指向 Flyout 组件的引用。
 * @deprecated 想不到吧，该函数没写多久就标记为弃用了，请使用更强大的 v-model 来实现传参。
 * @returns 指向 Flyout 组件的引用。
 */
export function refFlyout() {
	return ref<InstanceType<typeof Flyout>>();
}

/**
 * 指向 Menu 组件的引用。
 * @deprecated 想不到吧，该函数没写多久就标记为弃用了，请使用更强大的 v-model 来实现传参。
 * @returns 指向 Menu 组件的引用。
 */
export function refMenu() {
	return ref<InstanceType<typeof Menu>>();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownFunctionType = (...args: any[]) => any;

/**
 * 获取基类组件的显示、隐藏函数。
 * @deprecated 想不到吧，该函数没写多久就标记为弃用了，请使用更强大的 v-model 来实现传参。
 * @param base - 基类组件。如果未提供，则会创建一个新的空引用。
 * @returns 基类组件及其显示、隐藏函数。
 */
export function useBaseComponentShowHide<T extends { show: UnknownFunctionType; hide: UnknownFunctionType }>(base?: Ref<T | undefined>) {
	if (!base) base = ref<T>();
	return {
		ref: base,
		show: (...args: Parameters<T["show"]>): ReturnType<T["show"]> => base!.value?.show(...args),
		hide: (...args: Parameters<T["hide"]>): ReturnType<T["hide"]> => base!.value?.hide(...args),
	};
}
