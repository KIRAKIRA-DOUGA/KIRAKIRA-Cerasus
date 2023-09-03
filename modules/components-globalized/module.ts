import { createResolver, defineNuxtModule } from "@nuxt/kit";
import { lstat, readFile, readdir, writeFile } from "fs/promises";
import { throttle } from "lodash-es";
import { parse, basename } from "path";
import { enumerate } from "../../utils/array";
import { environment } from "../../utils/environment";

type WatchEvent = "update" | "remove";
type Initial = (event?: WatchEvent, path?: string[]) => Promise<void>;
const filenameWithoutExtension = (filename: string) => parse(filename).name;

export default defineNuxtModule({
	setup(_options, nuxt) {
		if (environment.production) return;
		const { resolve: localResolve } = createResolver(import.meta.url);
		const { resolve } = createResolver(localResolve("../../.nuxt"));
		
		const registered = {
			components: [] as string[],
			classes: [] as string[],
			icons: [] as string[],
			lotties: [] as string[],
		};

		const initComponentsGlobalized: Initial = async (event, path) => {
			if (event === "update" && path) {
				if (path[1] === "components")
					if (registered.components.includes(path.at(-1)!)) return;
				if (path[1] === "classes") {
					console.log(registered.classes, path.at(-1));
					if (registered.classes.includes(path.at(-1)!)) return;
				}
			}
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
			registered.components = components.map(component => basename(component.path));
			registered.classes = classes.slice();
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
					result += `\texport { ${filenameWithoutExtension(klass)} } from "../classes/${klass}";\n`;
				result += "}\n\nexport { };\n";
				return result;
			})());
		};

		const initIcons: Initial = async (event, path) => {
			if (event === "update" && path) {
				if (path[2] === "icons")
					if (registered.icons.includes(path.slice(path.indexOf("icons") + 1).join("/"))) return;
				if (path[2] === "lotties") {
					console.log(registered.icons, path.at(-1));
					if (registered.lotties.includes(path.slice(path.indexOf("lotties") + 1).join("/"))) return;
				}
			}
			const icons: string[] = [], lotties: string[] = [];
			registered.icons = []; registered.lotties = [];
			const fileDisplay = async (filePath: string, carrier: string[], reg: string[], parents: string[] = []) => {
				const files = await readdir(resolve(filePath));
				for (const filename of files) {
					const filedir = resolve(filePath, filename);
					const stats = await lstat(filedir);
					const basename = filenameWithoutExtension(filename);
					if (stats.isFile()) {
						carrier.push([...parents, basename].join("/"));
						reg.push([...parents, filename].join("/"));
					} else if (stats.isDirectory())
						await fileDisplay(filedir, carrier, reg, [...parents, filename]);
				}
			};
			await Promise.all([
				fileDisplay("../assets/icons", icons, registered.icons),
				fileDisplay("../assets/lotties", lotties, registered.lotties),
			]);
			const D_TS_NAME = "icons.d.ts";
			await writeFile(resolve("../types/", D_TS_NAME), (() => {
				let result = 'declare global {\n\ttype DeclaredIcons = "';
				result += icons.join('" | "');
				result += '" | (string & {});\n\ttype DeclaredLotties = "';
				result += lotties.join('" | "');
				result += '" | (string & {});\n}\n\nexport { };\n';
				return result;
			})());
		};

		nuxt.hook("prepare:types", _option => {
			initComponentsGlobalized();
			initIcons();
		});

		const throttledFn = throttle((event: WatchEvent, path: string[]) => {
			if (["components", "classes"].includes(path[1]))
				initComponentsGlobalized();
			else if (path[1] === "assets" && ["icons", "lotties"].includes(path[2]))
				initIcons();
		}, 5000);

		nuxt.hook("nitro:init", nitro => {
			nitro.storage.watch((event, file) => {
				const path = file.split(":");
				if (path[0] !== "root" || !path[1]) return;
				throttledFn(event, path);
			});
		});
	},
});
