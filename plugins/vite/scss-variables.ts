import { readFileSync } from "fs";
import { VariableName } from "../../classes/VariableName";

// 代码参考自我在 Stack Overflow 提的问题中人们回答的答案：https://stackoverflow.com/questions/76693342
export default () => ({
	name: "vite-plugin-scss-variables",

	load(id: string) {
		if (!id.endsWith(".vue")) return;

		const src = readFileSync(id, "utf-8");
		// 原文建议我通过依赖 https://www.npmjs.com/package/scss-parser 解析 SCSS 中的变量，但我个懒人直接用正则表达式提取了。
		const styles = [...src.matchAll(/<style.*?lang="scss".*?>(.*?)<\/style>/gisu)].map(block => block[1].trim());
		const variables: AnyObject = {}, numbers: AnyObject = {};
		variables.numbers = numbers;

		for (const style of styles) {
			const declarations = style.match(/(?<=\s|^)\$[\w-]+\s*:.*?;/gsu);
			if (!declarations) continue;
			for (const declaration of declarations) {
				let name = declaration.match(/(?<=^\$)[\w-]+(?=\s*:)/su)?.[0];
				const value = declaration.match(/(?<=:).*?(?=;)/su)?.[0].replaceAll(/\s+/g, " ").trim();
				if (!name || !value) continue;
				name = new VariableName(name).camel;
				if (name in variables) continue;
				variables[name] = value;
				numbers[name] = parseFloat(value);
			}
		}

		return src.replaceAll("useScssVariables()", JSON.stringify(variables));
	},
});
