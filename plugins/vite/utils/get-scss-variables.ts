/* eslint-disable require-jsdoc */
import { VariableName } from "../../../classes/VariableName";

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
	return `<script lang="ts">
	const ${objectName} = createScssVariablesReference(${JSON.stringify(variables)});
</script>

`;
}

export function getScssVariablesFromModule(styles: string | string[]) {
	const { variables, numbers } = getScssVariables(styles);
	Object.defineProperty(variables, "numbers", { value: numbers, enumerable: true });
	return `export default Object.freeze(${JSON.stringify(variables)});`;
}
