import { PaletteType, ThemeSetType } from "./types";

export const Theme = {
	/** 设定主题模式（包含自动）。 */
	get theme() { return useState<ThemeSetType>("theme", () => "system"); },
	/** 主题色/调色板。 */
	get palette() { return useState<PaletteType>("palette", () => "pink"); },
};
