import { resolve, parse, extname } from "path";
import { fileURLToPath } from "url";
import { readdir, readFile } from "fs/promises";

export const __dirname = fileURLToPath(new URL(".", import.meta.url));
const filenameWithoutExtension = (filename: string) => parse(filename).name;
const excludesFiles = ["types.ts"];

/**
 * 获取所有翻译文件数据。
 * @returns 所有翻译文件数据。
 */
export default async function getLocales() {
	const path = resolve(__dirname, "../../..");
	const files = await readdir(path);
	const object: NestedLocaleData = {};
	for (const file of files) {
		if (extname(file) !== ".ts") continue;
		if (excludesFiles.includes(file)) continue;
		const content = await readFile(resolve(path, file), "utf-8");
		const lang = filenameWithoutExtension(file);

		const stringPart = content.match(/(?<== ?){.*}/s)?.[0];
		if (!stringPart) continue;
		// eslint-disable-next-line no-eval
		object[lang] = eval(`(${stringPart})`);
	}
	return object;
}
