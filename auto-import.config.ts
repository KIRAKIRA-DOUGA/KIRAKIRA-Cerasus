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
	["smooth-value/vue"]: [
		"useSmoothValue",
		"getSpringByFps",
	],
};

/*
 * 在此处导出所有需要自动导入的第三方库的 Vue 组件。
 */
export const autoVueComponent: AutoImportConfig = {
	"@number-flow/vue": [
		["default", "NumberFlow"],
	],
};

export type AutoImportConfig = {
	[packageName: string]: (string | [name: string, as: string])[];
};

export const autoImportConfig = Object.entries(autoImport).map(([packageName, imports]) => ({
	from: packageName,
	imports: imports.map(item => typeof item === "string" ? item : { name: item[0], as: item[1] }),
}));
