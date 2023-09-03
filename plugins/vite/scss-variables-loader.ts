import { readFileSync } from "fs";
import { resolve } from "path";
import { getScssVariablesFromModule } from "./utils/get-scss-variables";

const virtualModuleId = "virtual:scss-var:";

const scssVariablesLoader = () => ({
	name: "scss-variables-loader",

	resolveId(id: string) {
		if (id.startsWith(virtualModuleId))
			return "\0" + id;
	},

	load(id: string) {
		const resolvedVirtualModuleId = "\0" + virtualModuleId;
		if (id.startsWith(resolvedVirtualModuleId)) {
			const path = id.replace(resolvedVirtualModuleId, "");
			const resolvedPath = resolve(__dirname, "../../assets/styles", path + ".scss");
			const src = readFileSync(resolvedPath, "utf-8");
			return getScssVariablesFromModule(src);
		}
	},
});

export default scssVariablesLoader;
