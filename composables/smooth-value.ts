import { Point } from "classes/Point";

/**
 * 根据一个数值、数组、点创建一个平滑的响应式引用变量。
 * @param current - 不平滑的当前值。
 * @param speed - 平滑速度。
 * @returns 平滑值响应式引用变量。
 * @see https://codepen.io/nanonansen/pen/oRWmaY 参考自视差平滑移动。
 */
export function useSmoothValue<T extends number | number[] | Point>(current: MaybeRef<T>, speed: number) {
	const smoothValue = ref(toValue(current)) as Ref<T>;
	const animationId = ref<number>();
	onMounted(() => {
		const animation = () => {
			const value = toValue(current);
			if (typeof value === "number") {
				const prev = smoothValue as Ref<number>;
				prev.value += (value - prev.value) * speed;
			} else if (value instanceof Point) {
				const prev = smoothValue as Ref<Point>;
				prev.value.x += prev.value.distanceX(value) * speed;
				prev.value.y += prev.value.distanceY(value) * speed;
			} else {
				const prev = smoothValue as Ref<number[]>;
				for (let i = 0; i < value.length; i++)
					prev.value[i] += (value[i] - prev.value[i]) * speed;
			}
			animationId.value = requestAnimationFrame(animation);
		};
		animation();
	});
	onUnmounted(() => {
		cancelAnimationFrame(animationId.value!);
	});
	return smoothValue;
}
