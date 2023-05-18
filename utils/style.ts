/**
 * 取消元素的变换后获取元素的矩形边界值。
 *
 * 这一切的行为就像 `getBoundingClientRect()` 一样，但它会使所有转换无效，并将元素*恢复*到其原始位置。这甚至适用于复杂的平移和旋转。美妙之处在于它将矩阵逆应用到变换矩阵上，并在此过程中使 getBoundingClientRect 发生变化。
 * @example let { top, left } = nullifyTransforms(el);
 * @see https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms
 * StackOverflow 上那个令人敬畏的答案。
 * @todo 也可以扩展为具有宽度/高度支持，但是这不是强制性的，我只需要我的用例的顶部/左侧。
 * @param el - HTML DOM 元素。
 * @returns 元素的真正矩形边界值。
 */
export function nullifyTransforms(el: HTMLElement) {
	// add sanity checks and default values

	const { top, left, width, height } = el.getBoundingClientRect();
	const transformArr = parseTransform(el);

	if (transformArr.length === 6) {
		// 2D 矩阵
		// 需要一些数学来应用矩阵的逆运算
		// 那是元素变换的矩阵
		// A 缩放 X
		// B 剪切 Y
		// C 剪切 X
		// D 缩放 Y
		// E 平移 X
		// F 平移 Y
		const t = transformArr;
		const det = t[0] * t[3] - t[1] * t[2];

		return {
			width: width / t[0],
			height: height / t[3],
			left: (left * t[3] - top * t[2] + t[2] * t[5] - t[4] * t[3]) / det,
			top: (-left * t[1] + top * t[0] + t[4] * t[1] - t[0] * t[5]) / det,
		};
	} else
		/* if (transformArr.length > 6) */
		// 3D 矩阵
		// 尚未完成计算以应用 4x4 矩阵的逆运算
		return { top, left, width, height };

	/**
	 * 解析变换。
	 * @param el - HTML DOM 元素。
	 * @returns 解析变换值。
	 */
	function parseTransform(el: HTMLElement) {
		const transform = window.getComputedStyle(el).transform;

		// 添加健全性检查。
		return transform
			.split(/\(|,|\)/)
			.slice(1, -1)
			.map(function (v) {
				return parseFloat(v);
			});
	}
}
