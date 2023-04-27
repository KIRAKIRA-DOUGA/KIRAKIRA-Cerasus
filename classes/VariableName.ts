/**
 * 变量名辅助类。
 *
 * 用于方便地把变量名称转换成驼峰、连字符等。
 */
export class VariableName {
	private words: string[] = [];

	constructor(str: string) {
		this.value = str;
	}

	/**
	 * 重新设值。
	 * @param str - 任意形式的变量名。
	 */
	set value(str: string) {
		str = str.trim();
		if (str.includes("_"))
			this.words = str.split("_");
		else if (str.includes("-"))
			this.words = str.split("-");
		else {
			const splited = str.replaceAll(/(?!^)([A-Z])/g, " $1").replaceAll(/(\d+)/g, " $1 ").replaceAll(/\s+(?=\s)|^\s+|\s+$/g, "");
			this.words = splited.split(" ");
		}
	}

	/**
	 * 转换为连字符式。
	 */
	get kebab() {
		return this.words.join("-").toLowerCase();
	}

	/**
	 * 转换为下划线式。
	 */
	get snake() {
		return this.words.join("_").toLowerCase();
	}

	/**
	 * 转换为大驼峰式。
	 */
	get pascal() {
		return this.words.map(word => capitalize(word)).join("");
	}

	/**
	 * 转换为小驼峰式。
	 */
	get camel() {
		return this.words.map((word, i) => i ? capitalize(word) : word.toLowerCase()).join("");
	}
}

/**
 * 将单词转换为首字母大写，其它字母为小写。
 * @param str - 单词。
 * @returns 首字母大写，其它字母为小写的单词。
 */
function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
