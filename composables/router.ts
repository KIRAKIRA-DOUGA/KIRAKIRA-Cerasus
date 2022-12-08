/**
 * 获取系统当前的路由。
 * @returns 系统路由。
 */
export function getRoutePath(): string {
	const router = useRouter();
	return router.currentRoute.value.path;
}

/**
 * 传入路由发生变化后的回调函数。
 * @param callback 回调函数，其参数依次为新值、旧值。
 */
export function watchRoute(callback: (newValue: string, oldValue: string) => void): void {
	const router = useRouter();

	watch(
		() => router.currentRoute.value.path,
		callback,
	);
}
