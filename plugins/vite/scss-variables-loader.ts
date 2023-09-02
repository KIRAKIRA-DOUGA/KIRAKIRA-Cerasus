import { readFileSync } from "fs";
import { getScssVariablesFromModule } from "./utils/get-scss-variables";

const suffix = /.scss\?var$/;

// FIXME: 根本用不了。
const scssVariablesLoader = () => ({
	name: "scss-variables-loader",

	load(id: string) {
		if (suffix.test(id)) {
			const src = readFileSync(id.replace(suffix, ".scss"), "utf-8");
			return getScssVariablesFromModule(src);
		}
	},
});

export default scssVariablesLoader;
