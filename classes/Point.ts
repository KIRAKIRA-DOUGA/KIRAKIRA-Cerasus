/**
 * 点类。
 */
export class Point {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * 求两点间距离。
	 * @param point - 另一个点。
	 * @returns 距离。
	 */
	distance(point: Point): number {
		return Math.hypot(point.x - this.x, point.y - this.y);
	}

	/**
	 * 求两点间 X 轴距离。
	 * @param point - 另一个点。
	 * @returns X 轴距离。
	 */
	distanceX(point: Point): number {
		return point.x - this.x;
	}

	/**
	 * 求两点间 Y 轴距离。
	 * @param point - 另一个点。
	 * @returns Y 轴距离。
	 */
	distanceY(point: Point): number {
		return point.y - this.y;
	}

	/**
	 * 返回对象的字符串表示形式。
	 * @returns 对象的字符串表示形式。
	 */
	toString() {
		return `(${this.x}, ${this.y})`;
	}
}
