import { createResolver, defineNuxtModule } from "@nuxt/kit";
import { lstat, readFile, readdir, writeFile } from "fs/promises";
import { throttle } from "lodash";
import { parse } from "path";
import { enumerate } from "../../utils/array";
import { environment } from "../../utils/environment";

export default defineNuxtModule({
	setup(_options, nuxt) {
		if (environment.production) return;
		const { resolve: localResolve } = createResolver(import.meta.url);
		const { resolve } = createResolver(localResolve("../../.nuxt"));

		const initComponentsGlobalized = async () => {
			let components_string: string;
			while (true)
				try {
					components_string = await readFile(resolve("components.d.ts"), "utf-8");
					if (!components_string || components_string.trim() === "") continue;
					break;
				} catch { }
			const components = Array.from(components_string.matchAll(/export const (?<name>\w+): typeof import\("(?<path>.*)"\)\['(?<member>\w+)'\]/g), item => item.groups as { name: string; path: string; member: string }).filter(item => !item.name.startsWith("Lazy"));
			const D_TS_NAME = "components-globalized.d.ts";
			const classes = await readdir(resolve("../classes"));
			await writeFile(resolve("../types/", D_TS_NAME), (() => {
				let result = "";
				for (const [index, klass] of enumerate(classes, 1))
					result += `import * as _${index} from "../classes/${klass}";\n`;
				result += "\ndeclare global {\n";
				result += "\t// components\n";
				for (const component of components)
					result += `\texport const ${component.name}: typeof import("${component.path}")["${component.member}"];\n`;
				result += "\n\t// classes\n";
				for (const klass of classes)
					result += `\texport { ${parse(klass).name} } from "../classes/${klass}";\n`;
				result += "}\n\nexport { };\n";
				return result;
			})());
		};

		const initIcons = async () => {
			const icons: string[] = [];
			const fileDisplay = async (filePath: string, parents: string[] = []) => {
				const files = await readdir(resolve(filePath));
				for (const filename of files) {
					const filedir = resolve(filePath, filename);
					const stats = await lstat(filedir);
					const basename = parse(filename).name;
					if (stats.isFile()) icons.push([...parents, basename].join("/"));
					else if (stats.isDirectory()) await fileDisplay(filedir, [...parents, filename]);
				}
			};
			await fileDisplay("../assets/icons");
			const D_TS_NAME = "icons.d.ts";
			await writeFile(resolve("../types/", D_TS_NAME), (() => {
				let result = 'declare global {\n\ttype DeclaredIcons = "';
				result += icons.join('" | "');
				result += '" | (string & {});\n}\n\nexport { };\n';
				return result;
			})());
		};

		nuxt.hook("prepare:types", _option => {
			initComponentsGlobalized();
			initIcons();
		});

		const throttledFn = throttle((path: string[]) => {
			if (path[1] === "components" || path[1] === "classes")
				initComponentsGlobalized();
			else if (path[1] === "assets" && path[2] === "icons")
				initIcons();
		}, 5000);

		nuxt.hook("nitro:init", nitro => {
			nitro.storage.watch((event, file) => {
				const path = file.split(":");
				if (path[0] !== "root" || event === "remove" || !path[1]) return;
				throttledFn(path);
			});
		});
	},
});
