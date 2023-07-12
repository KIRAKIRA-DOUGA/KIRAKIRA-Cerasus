import { resolve } from "path";

/**
 * 定义目录别名。
 * @param dirname - 根目录地址。
 * @param paths - 目录们。
 * @returns 别名对象。
 */
export default function defineAlias(dirname: string, ...paths: string[]) {
	const aliases = {} as Record<string, string>;
	for (const path of paths) {
		const aliasName = path.match(/(?<=\/)[^/]*(?=\/*$)/)?.[0] ?? path;
		aliases[aliasName] = resolve(dirname, path);
	}
	return aliases;
}
