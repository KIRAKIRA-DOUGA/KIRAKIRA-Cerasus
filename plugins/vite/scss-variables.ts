import { readFileSync } from "fs";
import { VariableName } from "../../classes/VariableName";

export default () => ({
	name: "vite-plugin-scss-variables",

	load(id: string) {
		if (!id.endsWith(".vue")) return;

		const src = readFileSync(id, "utf-8");
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

	/* transform(src: string, id: string) {
		if (/vue&type=style/.test(id) && /lang\.scss/.test(id)) {
			const filename = id.match(/\w+(?=\.vue)/i)?.[0];
			return "export default Component => { " +
				`Component.__filename = ${filename ? JSON.stringify(filename) : "undefined"}; ` +
				`Component.__style = ${JSON.stringify(src)}; ` +
				"};";
		}
	}, */
});
