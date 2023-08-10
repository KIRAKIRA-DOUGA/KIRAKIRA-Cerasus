import { resolve } from "path";
import fs from "fs/promises";
import ts from "typescript";
import * as terser from "terser";
import htmlMinifierTerser from "html-minifier-terser";
import { Nuxt } from "nuxt/schema";
import sass from "sass";

/**
 * 将 TypeScript 源码编译为 JavaScript 代码。
 * @param source - 源码。
 * @param target - 目标环境。
 * @returns 编译后的 JavaScript 代码。
 */
export function compileTypeScript(source: string, target: keyof typeof ts.ScriptTarget = "ESNext") {
	return ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ESNext,
			target: ts.ScriptTarget[target],
		},
	}).outputText;
}

/**
 * 将 Sass/SCSS 源码编译为 CSS 代码。
 * @param source - 源码。
 * @returns 编译后的 CSS 代码。
 */
export function compileSass(source: string) {
	return sass.compileString(source).css;
}

/**
 * 将 Sass/SCSS 的**文件**编译为 CSS 代码。
 * @param filename - 文件路径及名称。
 * @returns 编译后的 CSS 代码。
 */
export function compileSassFile(...filename: string[]) {
	return sass.compile(resolve(...filename)).css;
}

/**
 * 压缩 JavaScript 源码。
 * @param source - 源码。
 * @returns 压缩后的代码。
 */
export async function minifyJavaScript(source: string) {
	return (await terser.minify(source)).code ?? "";
}

/**
 * 压缩 HTML 源码。
 * @param source - 源码。
 * @returns 压缩后的代码。
 */
export async function minifyHtml(source: string) {
	return await htmlMinifierTerser.minify(source, {
		removeComments: true,
		processConditionalComments: true,
		collapseWhitespace: true,
		collapseInlineTagWhitespace: true,
		minifyCSS: true,
		minifyJS: true,
	});
}

/**
 * 将 JavaScript 源码外嵌套一层 IIFE 自启动函数。
 * @param source - 源码。
 * @returns 转换后的代码。
 */
export function wrapIife(source: string) {
	return `(function () {\n${source}\n})();`;
}

/**
 * 获取一个根据路径异步读取文件的解析器。
 * @param dirname - 当前目录路径，使用 `__dirname` 填充之。
 * @returns 根据路径异步读取文件的解析器。
 */
export function createReadFileResolver(dirname: string) {
	return {
		/**
		 * 根据路径异步读取文件。
		 * @param path - 相对路径。
		 * @returns 以 UTF-8 编码读取的文件内容。
		 */
		readFile: (...paths: string[]) =>
			fs.readFile(resolve(dirname, ...paths), "utf-8"),
		/**
		 * 最右边的参数被认为是 {to}。其他参数被视为 {from} 的数组。
		 *
		 * 从最左边的 {from} 参数开始，将 {to} 解析为绝对路径。
		 *
		 * 如果 {to} 还不是绝对的，则 {from} 参数将按从右到左的顺序前置，直到找到绝对路径为止。如果在使用所有 {from} 路径后仍然找不到绝对路径，则也会使用当前工作目录。生成的路径将被规范化，除非路径被解析到根目录，否则尾部斜杠将被删除。
		 *
		 * @param paths - 路径或路径段的序列。
		 *
		 * @returns 解析后的路径。
		 *
		 * @throw {TypeError} 如果任何参数不是字符串，则抛出错误。
		 */
		resolve: (...paths: string[]) =>
			resolve(dirname, ...paths),
	};
}

/**
 * 获取并操作 App 的 head。
 * @param nuxt - Nuxt App。
 * @returns App 全局 head。
 */
export function useNuxtHead(nuxt: Nuxt) {
	return nuxt.options.app.head ??= [] as typeof nuxt.options.app.head;
}
