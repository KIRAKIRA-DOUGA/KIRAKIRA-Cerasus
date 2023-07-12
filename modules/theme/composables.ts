import { PaletteType, ThemeSetType } from "./types";

export const Theme = {
	/** 设定主题模式（包含自动）。 */
	get theme() { return useState<ThemeSetType>("theme", () => "system"); },
	/** 主题色/调色板。 */
	get palette() { return useState<PaletteType>("palette", () => "pink"); },
	/** 直接获取主题色的颜色代码，手动修改其值是无效的。 */
	get meta() { return useState<string>("meta-theme-color", () => "#f06e8e"); },
};
