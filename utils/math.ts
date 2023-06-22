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

/**
 * 主要针对负数的一个拟定的取模，使其更适合实际使用，返回一个非负数。
 *
 * 比如说。当随机给出一个角度，但实际上只有取其除以 360° 所得的余数才是我们需要的真正角度，关于转了几圈我们并不在乎。然而当被除数为负数的时候，直接使用 `%` 会发生一些变化。我们希望这样求出来的结果也是更符号实际使用的一个正数。
 * @param a - 被除数。
 * @param b - 除数。
 * @returns 余数。
 */
export function PNMod(a: number, b: number) {
	if (b === 0) return NaN;
	b = Math.abs(b);
	let i = 0;
	while (a + b * i < 0)
		i++;
	return (a + b * i) % b;
}
