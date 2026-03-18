/*
 * 在此处导出所有需要自动导入的第三方库的模块。
 */

const autoImport: AutoImportConfig = {
	"@tiptap/vue-3": [
		"Editor",
	],
	"path-browserify-es": [
		["default", "path"],
	],
	"variable-name-conversion": [
		["default", "VariableName"],
	],
	"temporal-polyfill": [
		"Temporal",
	],
};

export type AutoImportConfig = {
	[packageName: string]: (string | [name: string, as: string])[];
};

export default Object.entries(autoImport).map(([packageName, imports]) => ({
	from: packageName,
	imports: imports.map(item => typeof item === "string" ? item : { name: item[0], as: item[1] }),
}));
