/**
 * 监听是否有伪类 `:active` 的事件。
 * @param el - HTML DOM 元素。
 * @param onPress - 指针按下回调事件。
 * @param onLift - 指针松开回调事件。
 */
export function usePressed(el: MaybeRef<HTMLElement | ComponentPublicInstance | undefined>, onPress?: Function, onLift?: Function) {
	const isPointerDown = ref(false);
	const isPointerEnter = ref(false);
	
	useEventListener(el, "pointerdown", onPointerDown);
	useEventListener(el, "pointerenter", onPointerEnter);
	
	/**
	 * 指针按下事件。
	 * @param e - 指针事件。
	 */
	function onPointerDown(e: PointerEvent) {
		const div = e.currentTarget as HTMLDivElement;
		onPress?.();
		isPointerDown.value = true;
		isPointerEnter.value = true;
		window.addEventListener("pointerup", onPointerUp);
		div.addEventListener("pointerleave", onPointerLeave);
	}

	/**
	 * 指针进入事件。
	 * @param e - 指针事件。
	 */
	function onPointerEnter(e: PointerEvent) {
		if (isPointerDown.value)
			onPointerDown(e);
	}

	/**
	 * 指针松开事件。
	 * @param e - 指针事件。
	 */
	function onPointerUp(e: PointerEvent) {
		isPointerDown.value = false;
		onPointerLeave(e);
		window.removeEventListener("pointerup", onPointerUp);
	}

	/**
	 * 指针离开事件。
	 * @param _e - 指针事件。
	 */
	function onPointerLeave(_e: PointerEvent) {
		if (isPointerEnter.value)
			onLift?.();
		isPointerEnter.value = false;
		getElFromComponentInstance(el)?.removeEventListener("pointerleave", onPointerLeave);
	}
}
