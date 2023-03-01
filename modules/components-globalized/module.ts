import { createResolver, defineNuxtModule } from "@nuxt/kit";
import { readdir, readFile, writeFile } from "fs/promises";
import { parse } from "path";

export default defineNuxtModule({
	setup(_options, nuxt) {
		const { resolve: localResolve } = createResolver(import.meta.url);
		const { resolve } = createResolver(localResolve("../../.nuxt"));
		nuxt.hook("prepare:types", async _option => {
			let components_string: string;
			while (true)
				try {
					components_string = await readFile(resolve("components.d.ts"), "utf-8");
					if (!components_string || components_string.trim() === "") continue;
					break;
				} catch { }
			const components = [...components_string.matchAll(/export const (?<name>\w+): typeof import\("(?<path>.*)"\)\['(?<member>\w+)'\]/g)].map(item => item.groups as { name: string; path: string; member: string }).filter(item => !item.name.startsWith("Lazy"));
			const D_TS_NAME = "components-globalized.d.ts";
			const classes = await readdir(resolve("../classes"));
			await writeFile(resolve("../types/", D_TS_NAME), (() => {
				let result = "declare global {\n";
				result += "\t// components\n";
				for (const component of components)
					result += `\texport const ${component.name}: typeof import("${component.path}")["${component.member}"];\n`;
				result += "\n\t// classes\n";
				for (const klass of classes)
					result += `\texport { ${parse(klass).name} } from "../classes/${klass}";\n`;
				result += "}\n\nexport { };\n";
				return result;
			})());
		});
	},
});
