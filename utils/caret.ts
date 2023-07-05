/**
 * 文本光标辅助操作对象。
 */
export const Caret = {
	/**
	 * 获取文本光标的坐标。
	 * @param input - 输入框元素（如果有）。
	 * @returns 文本光标的坐标。
	 */
	get(input?: MaybeRef<HTMLInputElement>) {
		if (input) {
			input = toValue(input);
			return input.selectionStart;
		}
		const selection = window.getSelection();
		if (selection === null) return null;
		return selection.anchorOffset;
	},

	/**
	 * 设置文本光标的坐标。
	 * @param element HTML DOM 元素。
	 * @param offset 文本光标的坐标。
	 */
	set(element: MaybeRef<Element>, offset: number) {
		element = toValue(element);
		
		if (element instanceof HTMLInputElement) {
			element.setSelectionRange(offset, offset);
			return;
		}
		
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
	},
};
