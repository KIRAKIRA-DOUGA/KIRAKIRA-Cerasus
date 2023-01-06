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
