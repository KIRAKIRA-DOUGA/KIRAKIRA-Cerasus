/**
 * 探测元素溢出。如果元素超出了页面范围，则将其移动到页面内。
 * @private
 * @param location - 元素的坐标（仅支持元组类型）。
 * @param size - 元素的尺寸（仅支持元组类型）。
 * @returns 返回移动入页面后的新坐标。
 */
function moveIntoPage_tuple(location: TwoD, size: TwoD) {
	const result = [...location] as typeof location;
	const windowSize = [window.innerWidth, window.innerHeight];
	for (let i = 0; i < 2; i++) {
		if (result[i] + size[i] > windowSize[i])
			result[i] = windowSize[i] - size[i];
		if (result[i] < 0)
			result[i] = 0;
	}
	return result;
}

/**
 * 探测元素溢出。如果元素超出了页面范围，则将其移动到页面内。
 * @param location - 元素的元组类型坐标。
 * @param size - 元素的元组类型尺寸。
 * @returns 返回移动入页面后的新坐标。
 */
export function moveIntoPage(location: MaybeRef<TwoD>, size?: MaybeRef<TwoD | DOMRect | undefined>): TwoD;
/**
 * 探测元素溢出。如果元素超出了页面范围，则将其移动到页面内。
 * @param element - HTML DOM 元素。
 * @returns 返回移动入页面后的新坐标样式声明。
 */
export function moveIntoPage(element: MaybeRef<HTMLElement>): { top: string; left: string };
/**
 * 探测元素溢出。如果元素超出了页面范围，则将其移动到页面内。
 * @param measureElement - 要测量的 HTML DOM 元素。
 * @param adjustElement - 要调整位置的 HTML DOM 元素。
 * @returns 返回移动入页面后的新坐标样式声明。
 */
export function moveIntoPage(measureElement: MaybeRef<HTMLElement>, adjustElement?: MaybeRef<HTMLElement | undefined>): { top: string; left: string };
/**
 * 探测元素溢出。如果元素超出了页面范围，则将其移动到页面内。
 * @param location - 元素的坐标。
 * @param size - 元素的尺寸。
 * @returns 返回移动入页面后的新坐标。
 */
export function moveIntoPage(location: MaybeRef<TwoD | HTMLElement>, size?: MaybeRef<TwoD | DOMRect | HTMLElement | undefined>) {
	location = toValue(location);
	size = toValue(size);
	const adjustElementStyle = size instanceof Element && size.style;
	let returnAsStyle = false;
	if (location instanceof Element) {
		returnAsStyle = true;
		const rect = location.getBoundingClientRect();
		location = [rect.x, rect.y];
		size = [rect.width, rect.height];
	}
	if (size instanceof DOMRect)
		size = [size.width, size.height];
	const result = moveIntoPage_tuple(location, size as TwoD);
	if (adjustElementStyle) {
		const adjustment = (["left", "top"] as const).map(pos => parseFloat(adjustElementStyle[pos])) as TwoD;
		location.forEach((original, i) => result[i] += adjustment[i] - original);
	}
	if (!returnAsStyle) return result;
	return getLocationStyle(result);
}

/**
 * 将二维坐标转换为位置的样式值。
 * @param location - 二维坐标。
 * @returns 位置的样式值。
 */
export function getLocationStyle(location: MaybeRef<TwoD>): CSSProperties {
	location = toValue(location);
	return location[0] !== 0 || location[1] !== 0 ? { left: location[0] + "px", top: location[1] + "px" } : {};
}

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

/**
 * @remarks 该函数由 Vite 插件调用，不应手动直接使用。
 * @access private
 * @param variables - 变量键值声明。
 * @returns 包装后的对象。
 */
export function createScssVariablesReference(variables: Record<string, string>) {
	Object.defineProperty(variables, "numbers", {
		enumerable: false,
		configurable: false,
		get() {
			const numbers: Record<string, number> = {};
			for (const [key, value] of Object.entries(variables))
				numbers[key] = parseFloat(value);
			return Object.freeze(numbers);
		},
	});
	Object.freeze(variables);
	return variables;
}
