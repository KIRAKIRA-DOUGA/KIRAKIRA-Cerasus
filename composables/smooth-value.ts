import { Point } from "classes/Point";

/**
 * 根据一个数值、数组、点创建一个平滑的响应式引用变量。
 * @param current - 不平滑的当前值。
 * @param speed - 平滑速度。
 * @returns 平滑值响应式引用变量。
 * @see https://codepen.io/nanonansen/pen/oRWmaY 参考自视差平滑移动。
 */
export function useSmoothValue<T extends number | number[] | Point>(current: MaybeRef<T>, speed: number) {
	if (speed <= 0 || speed > 1)
		throw new RangeError(`useSmoothValue speed 参数取值范围错误。参数值必须在 (0 ~ 1] 区间内，当前值为 ${speed}。`);
	const smoothValue = ref(toValue(current)) as Ref<T>;
	const animationId = ref<number>();
	const FRACTION_DIGITS = 6; // 保留 6 位小数。
	onMounted(() => {
		const animation = () => {
			const _speed = isPrefersReducedMotion() ? 1 : speed;
			const value = toValue(current);
			const getNewValue = (cur: number, prev: number) => +(prev + (cur - prev) * _speed).toFixed(FRACTION_DIGITS);
			if (typeof value === "number") {
				const prev = smoothValue as Ref<number>;
				prev.value = getNewValue(value, prev.value); // (value - prev.value) * _speed;
			} else if (value instanceof Point) {
				const prev = smoothValue as Ref<Point>;
				prev.value.x = getNewValue(value.x, prev.value.x); // (value.x - prev.value.x) * _speed;
				prev.value.y = getNewValue(value.y, prev.value.y); // (value.y - prev.value.y) * _speed;
			} else {
				const prev = smoothValue as Ref<number[]>;
				for (let i = 0; i < value.length; i++)
					prev.value[i] = getNewValue(value[i], prev.value[i]); // (value[i] - prev.value[i]) * _speed;
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
