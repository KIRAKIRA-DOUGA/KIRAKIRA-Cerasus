import { readFileSync } from "fs";
import { getScssVariablesFromScript } from "./utils/get-scss-variables";

// 代码参考自我在 Stack Overflow 提的问题中人们回答的答案：https://stackoverflow.com/questions/76693342
export default () => ({
	name: "vite-plugin-scss-variables",

	load(id: string) {
		if (!id.endsWith(".vue")) return;

		const MACRO = "useScssVariables()";
		const OBJECT_NAME = "__scssVariables__";
		const src = readFileSync(id, "utf-8");
		if (!src.includes(MACRO)) return;
		
		// 原文建议我通过依赖 https://www.npmjs.com/package/scss-parser 解析 SCSS 中的变量，但我个懒人直接用正则表达式提取了。
		const styles = Array.from(src.matchAll(/<style.*?lang="scss".*?>(.*?)<\/style>/gisu), block => block[1].trim());
		const declaration = getScssVariablesFromScript(styles, OBJECT_NAME);

		return src.replace(/(?<=<script.*?>)/, declaration).replaceAll(MACRO, OBJECT_NAME);
	},
});
