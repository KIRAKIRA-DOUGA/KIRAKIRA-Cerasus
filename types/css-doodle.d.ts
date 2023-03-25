export default class CSSDoodle extends HTMLElement {
	/**
	 * 指定当前 css-doodle 要显示的图案 CSS。
	 */
	use: string;
	/**
	 * 获取或设置行列个数。
	 */
	grid: Numberish;
	/**
	 * 更新样式。
	 * @param rule - 指定当前 css-doodle 要显示的图案 CSS。
	 */
	update(rule: string);
	/**
	 * 刷新样式。
	 */
	update();
}
