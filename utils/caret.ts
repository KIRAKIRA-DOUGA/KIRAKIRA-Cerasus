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

	/**
	 * 清除文本选择。
	 *
	 * 注意是不选择文本，而不是将选择文本删除。
	 */
	clear() {
		if (window.getSelection) {
			if (window.getSelection()?.empty) // Chrome
				window.getSelection()?.empty();
			else if (window.getSelection()?.removeAllRanges) // Firefox
				window.getSelection()?.removeAllRanges();
		} else if (document.selection) // IE?
			document.selection.empty();
	},
};

/**
 * 将文本插入指定文本框中光标的位置，如果选中了文本，则替换之。
 * @param input - 输入框。
 * @param text - 插入的文字。
 */
export function insertTextToTextBox(input: MaybeRef<HTMLInputElement | HTMLTextAreaElement>, text: string = "") {
	input = toValue(input);
	const { selectionStart: start, selectionEnd: end, value } = input;
	if (start === null || end === null) return;
	const newValue = value.slice(0, start) + text + value.slice(end);
	const newCaret = start + text.length;
	input.value = newValue;
	input.setSelectionRange(newCaret, newCaret);
}
