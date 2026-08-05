import { Point } from "classes/Point";
import { type MaybeRef, type Ref, computed, onMounted, onUnmounted, readonly, ref, toRef, toValue } from "vue";

type SmoothValueAcceptType = number | number[] | Point;
type SmoothValueChangeHandler<T extends SmoothValueAcceptType> = (current: T, previous: T) => void;
interface SmoothValueOptions<T extends SmoothValueAcceptType> {
	/** 减少动效并禁用平滑值。 */
	disabled?: boolean;
	/** 当平滑值发生变化时触发。 */
	onChange?: SmoothValueChangeHandler<T>;
	/** 当平滑值停止变化时触发。 */
	onStopChange?: SmoothValueChangeHandler<T>;
}

const FRACTION_DIGITS = 6; // 保留 6 位小数。
const EPSILON = 10 ** -FRACTION_DIGITS; // 0.000001; // Number.EPSILON
const isValueNotChanged = (cur: number, prev: number) => Math.abs(cur - prev) < EPSILON;

/**
 * 根据一个数值、数组、点创建一个平滑的响应式引用变量。
 * @param current - 不平滑的当前值。
 * @param spring - 平滑速度。
 * @returns 平滑值响应式引用变量。
 * @see https://codepen.io/nanonansen/pen/oRWmaY 参考自视差平滑移动。
 */
export function useSmoothValue<T extends SmoothValueAcceptType>(current: MaybeRef<T>, spring: number, options: SmoothValueOptions<T> = {}) {
	const reduceMotion = options.disabled || (environment.server ? false : isPrefersReducedMotion());
	if (spring <= 0 || spring > 1)
		throw new RangeError(`\`useSmoothValue\` \`spring\` parameter value range error\nThe parameter value must be within the range of (0, 1], the current value is ${spring}.`);
	const animationId = ref<number>();
	const prevTimestamp = ref<DOMHighResTimeStamp>();
	const _smoothValue = ref(toValue(current)) as Ref<T>;
	const smoothValue = computed({
		get: () => _smoothValue.value,
		set: cur => {
			const prev = _smoothValue.value;
			options.onChange?.(cur, prev);
			do {
				if (typeof cur === "number") {
					if (isValueNotChanged(cur, prev as number)) break;
				} else if (Array.isArray(cur))
					if (cur.length === (prev as number[]).length && cur.every((c, i) => isValueNotChanged(c, (prev as number[])[i]))) break;

				_smoothValue.value = cur;
				return;
			} while (false);
			options.onStopChange?.(cur as T, prev);
			_smoothValue.value = toValue(current);
		},
	});
	onMounted(() => {
		const animation = (timestamp?: DOMHighResTimeStamp) => {
			const value = toValue(current);
			const getNewValue = (cur: number, prev: number) => {
				if (!Number.isFinite(cur) || !Number.isFinite(prev)) return cur;
				const springByFps = getSpringByFps(timestamp, prevTimestamp, spring);
				return +(prev + (cur - prev) * springByFps).toFixed(FRACTION_DIGITS);
			};
			if (typeof value === "number") {
				const prev = smoothValue as Ref<number>;
				smoothValue.value = getNewValue(value, prev.value) as T;
			} else if (Array.isArray(value)) {
				const prev = smoothValue as Ref<number[]>;
				prev.value = prev.value.map((prev, i) => getNewValue(value[i], prev));
			}
			animationId.value = requestAnimationFrame(animation); // Note that `requestAnimationFrame` speed depends on your monitor FPS.
		};
		if (!reduceMotion) animation();
	});
	onUnmounted(() => {
		cancelAnimationFrame(animationId.value!);
	});
	if (reduceMotion) return readonly(toRef(current));
	return readonly(smoothValue);
}

function getSpringByFps(timestamp: DOMHighResTimeStamp | undefined, prevTimestamp: Ref<DOMHighResTimeStamp | undefined>, spring: number) {
	let fps = 60;
	if (timestamp) {
		if (prevTimestamp.value) fps = Math.max(1000 / (timestamp - prevTimestamp.value), 1);
		prevTimestamp.value = timestamp;
	}
	const springByFps = spring / (fps / 60);
	if (springByFps <= 0 || springByFps > 1) return 0; // 避免卡顿时值“弹射起步”。
	return springByFps;
}
