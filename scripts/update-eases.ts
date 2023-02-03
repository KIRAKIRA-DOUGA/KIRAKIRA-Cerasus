import fs from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stylesPath = resolve(__dirname, "../assets/styles");

const scss = await fs.promises.readFile(resolve(stylesPath, "_eases.scss"), "utf-8");
const variables = scss.match(/(?<=\$).*(?=:)/g);
if (!variables) throw new TypeError("No variable found!");

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

const kebabToCamelCase = (str: string) => str.toLowerCase().replace(/-(\w)/g, (_, w: string) => w.toUpperCase());

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

function createJsDoc(doc: string, indent: number = 0) {
	doc = doc.trim();
	if (doc === "") return "";
	const indentTab = "\t".repeat(indent);
	const lines = doc.split("\n");
	lines.forEach((line, i, lines) => (lines[i] = indentTab + " * " + line));
	let result = indentTab + "/**\n";
	result += lines.join("\n");
	result += "\n" + indentTab + " */";
	return result;
}

let scssModule = `// stylelint-disable property-no-unknown

@import "./eases";

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

declare const styles: Styles;

export default styles;
`;

fs.promises.writeFile(resolve(stylesPath, "eases.module.scss"), scssModule);
fs.promises.writeFile(resolve(stylesPath, "eases.module.scss.d.ts"), dTs);
