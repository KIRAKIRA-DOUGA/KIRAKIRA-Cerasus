export const THEME_SET_LIST = ["light", "dark", "system"] as const;
export const PALETTE_LIST = ["pink", "cyan", "blue", "green", "orange", "purple", "red", "yellow", "sky", "custom"] as const;

export type ThemeSetType = typeof THEME_SET_LIST[number];
export type ThemeType = Exclude<ThemeSetType, "system">; // 想加高对比色、红绿色盲配色吗？
export type PaletteType = typeof PALETTE_LIST[number] | (string & {});

export interface NuxtColorMode {
	theme: ThemeSetType;
	palette: PaletteType;
}
