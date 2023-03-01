import { readFile, writeFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { kebabToCamelCase } from "../utils/string";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stylesPath = resolve(__dirname, "../assets/styles/theme");

const scss = await readFile(resolve(stylesPath, "_eases.scss"), "utf-8");
const variables = scss.match(/(?<=\$).*(?=:)/g);
if (!variables) throw new TypeError("No variable found!");

/**
 * 根据变量名称获取其 SassDoc。
 * @param scss - SCSS 样式表文本内容。
 * @param variable - 变量名称。
 * @returns SassDoc。
 */
function getSassDoc(scss: string, variable: string) {
	const lines = scss.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (!line.includes("$" + variable)) continue;
		const docLines: string[] = [];
		for (let j = i - 1; j >= 0; j--) {
			let prevLine = lines[j].trim();
			if (!prevLine.match(/^\/\/\/(?!\/)/)) break;
			prevLine = prevLine.slice(3).trim();
			docLines.unshift(prevLine);
		}
		return docLines.join("\n").trim();
	}
	return "";
}

interface EaseInfo {
	kebabName: string;
	camelName: string;
	doc: string;
}

const eases: EaseInfo[] = [];

for (const variable of variables)
	eases.push({
		kebabName: variable,
		camelName: kebabToCamelCase(variable),
		doc: getSassDoc(scss, variable),
	});

/**
 * 创建 JSDoc。
 * @param doc - JSDoc 文本内容。
 * @param indent - 左边缩进的 TAB 值。
 * @returns JSDoc。
 */
function createJsDoc(doc: string, indent: number = 0) {
	doc = doc.trim();
	if (doc === "") return "";
	const indentTab = "\t".repeat(indent);
	const lines = doc.split("\n");
	lines.forEach((line, i, lines) => lines[i] = indentTab + " * " + line);
	let result = indentTab + "/**\n";
	result += lines.join("\n");
	result += "\n" + indentTab + " */";
	return result;
}

let scssModule = `// stylelint-disable property-no-unknown

@import "eases";

:export {
`;

for (const ease of eases)
	scssModule += `\t${ease.kebabName}: $${ease.kebabName};\n`;

scssModule += `}
`;

let dTs = `export type Styles = {
`;

for (const ease of eases) {
	const jsDoc = createJsDoc(ease.doc, 1);
	dTs += (jsDoc ? jsDoc + "\n" : "") + `\t${ease.camelName}: string;\n`;
}

dTs += `};

export type ClassNames = keyof Styles;

declare const styles: Readonly<Styles>;

export default styles;
`;

writeFile(resolve(stylesPath, "eases.module.scss"), scssModule);
writeFile(resolve(stylesPath, "eases.module.scss.d.ts"), dTs);
