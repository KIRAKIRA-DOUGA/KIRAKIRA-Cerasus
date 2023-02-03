/**
 * 获取文本光标的坐标。
 * @returns 文本光标的坐标。
 */
export function getCaret() {
	const selection = window.getSelection();
	if (selection === null) return null;
	return selection.anchorOffset;
}

/**
 * 设置文本光标的坐标。
 * @param element HTML DOM 元素。
 * @param offset 文本光标的坐标。
 */
export function setCaret(element: Element, offset: number) {
	const range = document.createRange();
	const selection = window.getSelection();
	if (selection === null) return;

	if (!element.textContent) return;
	offset = Math.min(offset, element.textContent.length) - 1;
	if (offset < 0) return;
	range.setStart(element, offset);
	range.collapse(true);

	selection.removeAllRanges();
	selection.addRange(range);
}
