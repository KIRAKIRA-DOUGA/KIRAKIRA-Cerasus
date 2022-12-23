export type ThemeType = "light" | "dark"; // 想加高对比色、红绿色盲配色吗？
export type ThemeSetType = ThemeType | "system";
export type PaletteType = "pink" | "cyan" | "blue" | "green" | "orange" | "purple" | "red" | "yellow" | "custom";
export interface NuxtColorMode {
	theme: ThemeSetType;
	palette: PaletteType;
}
