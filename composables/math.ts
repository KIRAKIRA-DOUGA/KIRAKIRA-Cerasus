/**
 * 把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。
 * @param val - 首选值。
 * @param min - 最小值。
 * @param max - 最大值。
 * @returns 限制在范围内的值。
 */
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
