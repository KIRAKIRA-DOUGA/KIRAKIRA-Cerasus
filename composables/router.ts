/**
 * 获取系统当前的路由
 * @returns string 系统路由
 */
export function getRoutePath(): string {
	const router = useRouter();
	return router.currentRoute.value.path;
}

/**
 * 传入路由发生变化后的回调函数
 * @param callback (nowValue: object, oldValue: object) => void
 */
export function watchRoute(callback: (nowValue: object, oldValue: object) => void): void {
	const router = useRouter();

	watch(
		() => router.currentRoute.value.path,
		callback,
	);
}
