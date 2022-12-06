/* eslint-disable prefer-template */

type Preprocessor = "scss" | "sass" | "less" | "stylus";

type Entries = {
	[p in Preprocessor]: string[];
} & {
	hoistUseStatements: boolean;
};

export default function styleResources(entries: Partial<Entries>) {
	type PreprocessorOption = { [p in Preprocessor]?: { additionalData: string } };
	const options = {} as PreprocessorOption;
	const convert = (paths: string[], templateCallback: (path: string) => string) =>
		({ additionalData: paths.map(templateCallback).join("\n") + "\n" });
	if (entries.scss) options.scss = convert(entries.scss, path => `@import "${path}";`);
	if (entries.sass) options.sass = convert(entries.sass, path => `@import ${path}`);
	if (entries.less) options.less = convert(entries.less, path => `@import "${path}";`);
	if (entries.stylus) options.stylus = convert(entries.stylus, path => `@import "${path}"`);
	return {
		preprocessorOptions: options,
	};
}
