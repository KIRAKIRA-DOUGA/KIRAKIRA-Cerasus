/**
 * Nuxt cannot auto import third party components directly without a module?
 * See: https://stackoverflow.com/a/79479078/19553213
 */

import { addComponent, defineNuxtModule } from "@nuxt/kit";
import type { AutoImportConfig } from "../../auto-import.config";

export default defineNuxtModule({
	setup(options: AutoImportConfig) {
		for (const [packageName, imports] of Object.entries(options))
			for (const item of imports) {
				const [name, as] = typeof item === "string" ? [item, item] : item;
				addComponent({
					name: as,
					export: name,
					filePath: packageName,
				});
			}
	},
});
