/* eslint-disable require-jsdoc */
import { VariableName } from "../../../classes/VariableName";
import { createScssVariablesReference } from "../../../utils/style";

const createScssVariablesReferenceFunctionName = "createScssVariablesReference";

export function getScssVariables(styles: string | string[]) {
	if (typeof styles === "string") styles = [styles];

	const originalVariables: Record<string, string> = {},
		variables: Record<string, string> = {},
		numbers: Record<string, number> = {};

	for (const style of styles) {
		const declarations = style.match(/(?<=\s|^)\$[\w-]+\s*:.*?;/gsu);
		if (!declarations) continue;
		for (const declaration of declarations) {
			const kebabName = declaration.match(/(?<=^\$)[\w-]+(?=\s*:)/su)?.[0];
			let value = declaration.match(/(?<=:).*?(?=;)/su)?.[0].replaceAll(/\s+/g, " ").trim();
			value = value?.replaceAll(/#{(.*?)}/g, (interpolation, variable) => {
				if (typeof variable !== "string") return interpolation;
				const interpolationValue = originalVariables[variable] as string | undefined;
				if (interpolationValue === undefined) return interpolation;
				return interpolationValue;
			});
			if (!kebabName || !value) continue;
			const camelName = new VariableName(kebabName).camel;
			if (camelName in variables) continue;
			originalVariables["$" + kebabName] = value;
			variables[camelName] = value;
			numbers[camelName] = parseFloat(value);
		}
	}
	
	return { variables, numbers };
}

export function getScssVariablesFromScript(styles: string | string[], objectName: string) {
	const { variables } = getScssVariables(styles);
	return `
	const ${objectName} = ${createScssVariablesReferenceFunctionName}(${JSON.stringify(variables)});
`;
}

export function getScssVariablesFromModule(styles: string | string[]) {
	const { variables } = getScssVariables(styles);
	const result = [
		createScssVariablesReference.toString(),
		`const variables = ${createScssVariablesReferenceFunctionName}(${JSON.stringify(variables)});`,
		"export default variables;",
		"export const numbers = variables.numbers;",
	];
	return result.join("\n\n") + "\n";
}
