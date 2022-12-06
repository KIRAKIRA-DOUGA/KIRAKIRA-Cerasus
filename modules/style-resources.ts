import { entries } from "../composables/object";

type Preprocessor = "scss" | "sass" | "less" | "stylus";
type AtRule = "import" | "use" | "require" | "forward";

type Entries = Record<Preprocessor, Partial<Record<AtRule, string[]>>> & { hoistUseStatements: boolean };

export default function styleResources(userOptions: Partial<Entries>) {
	type PreprocessorOption = { [p in Preprocessor]?: { additionalData: string } };
	const options = {} as PreprocessorOption;
	// const convert = (paths: string[], templateCallback: (path: string) => string) =>
	// 	({ additionalData: paths.map(templateCallback).join("\n") + "\n" });
	// if (entries.scss) options.scss = convert(entries.scss, path => `@import "${path}";`);
	// if (entries.sass) options.sass = convert(entries.sass, path => `@import ${path}`);
	// if (entries.less) options.less = convert(entries.less, path => `@import "${path}";`);
	// if (entries.stylus) options.stylus = convert(entries.stylus, path => `@import "${path}"`);
	for (const [preprocessor, atRules] of entries(userOptions)) {
		if (preprocessor === "hoistUseStatements" || typeof atRules !== "object") continue;
		let additionalData = "";
		for (const [atRule, paths] of entries(atRules)) {
			if (paths.length === 0) continue;
			// eslint-disable-next-line prefer-template
			additionalData += paths.map(path => `@${atRule} "${path}";`).join("\n") + "\n";
		}
		if (additionalData.trim() !== "") options[preprocessor] = { additionalData };
	}
	return {
		preprocessorOptions: options,
	};
}
