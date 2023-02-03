import { entries } from "../utils/object";

type Preprocessor = "scss" | "sass" | "less" | "stylus" | "postcss";
type AtRule = "import" | "use" | "require" | "forward";

type Entries = Record<Preprocessor, Partial<Record<AtRule, string[]>>> & { hoistUseStatements: boolean };

export default function styleResources(userOptions: Partial<Entries>) {
	type PreprocessorOption = { [p in Preprocessor]?: { additionalData: string } };
	const options = {} as PreprocessorOption;
	for (const [preprocessor, atRules] of entries(userOptions)) {
		if (preprocessor === "hoistUseStatements" || typeof atRules !== "object") continue;
		let additionalData = "";
		for (const [atRule, paths] of entries(atRules)) {
			if (paths.length === 0) continue;
			additionalData += paths.map(path => `@${atRule} "${path}";`).join("\n") + "\n";
		}
		if (additionalData.trim() !== "") options[preprocessor] = { additionalData };
	}
	return options;
}
