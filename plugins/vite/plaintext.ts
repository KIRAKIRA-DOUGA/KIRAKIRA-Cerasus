/**
 * 生成一个利用纯文本来识别的 Vite 插件。
 * @param pluginName - Vite 插件的名称。比如：`plaintext-loader`。
 * @param fileRegex - 检测文件的类型、扩展名等。
 * @returns 利用纯文本来识别的 Vite 插件。
 */
export default function plaintextLoaderPluginGenerator(pluginName: string, fileRegex: RegExp) {
	return () => ({
		name: pluginName,

		transform(src: string, id: string) {
			if (fileRegex.test(id))
				return {
					code: `export default ${JSON.stringify(src)};`,
					map: null, // provide source map if available
				};
		},
	});
}
