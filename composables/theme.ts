export type ThemeType = "light" | "dark"; // 想加高对比色、红绿色盲配色吗？
export type ThemeSetType = ThemeType | "auto";
export type PaletteType = "pink" | "cyan" | "green" | "orange" | "purple" | "red" | "yellow" | "custom";

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)");

export const Theme = {
	/** 实际主题模式。 */
	get theme() { return useState<ThemeType>("theme", () => "light"); },
	/** 设定主题模式（包含自动）。 */
	get themeSet() { return useState<ThemeSetType>("themeSet", () => "auto"); },
	/** 主题色/调色板。 */
	get palette() { return useState<PaletteType>("palette", () => "pink"); },
	watchTheme() {
		watch(Theme.themeSet, themeSet => {
			if (themeSet === "auto") autoChange();
			else Theme.theme.value = themeSet;
		});
		function autoChange() {
			if (Theme.themeSet.value !== "auto") return;
			Theme.theme.value = process.client ? systemDark().matches ? "dark" : "light" : "light";
		}
		if (process.client) {
			autoChange();
			systemDark().addEventListener("change", autoChange);
		}
	},
};
