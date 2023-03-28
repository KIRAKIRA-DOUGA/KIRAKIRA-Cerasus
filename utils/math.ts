/**
 * 把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。
 * @param val - 首选值。
 * @param min - 最小值。
 * @param max - 最大值。
 * @returns 限制在范围内的值。
 */
export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

/**
 * 不准温度计
 * 即将一个数值从一个标度单位转移到另一个标度单位，新旧单位成线性关系，且不一定成正比关系，比如说摄氏度和华氏度的关系，返回对应的新值。
 * 比如说，将一个取值范围为 0 ~ 255 的颜色值转到 0 ~ 100 的值。
 * @param x - 待转换的原标度数值。
 * @param min - 原标度值（小）。
 * @param max - 原标度值（大）。
 * @param a - 新标度值（小）。
 * @param b - 新标度值（大）。
 * @returns 转换后的新标度数值。
 */
export function map(x: number, min: number, max: number, a: number, b: number) {
	return ((b - a) * (x - min) / (max - min)) + a;
}

/**
 * 生成给定两个数之间随机的整数。
 * @param min - 最小值。
 * @param max - 最大值。
 * @returns 范围内的随机整数。
 */
export const randBetween = (min: number, max: number) => Math.floor(Math.random() * (max + 1 - min) + min);
