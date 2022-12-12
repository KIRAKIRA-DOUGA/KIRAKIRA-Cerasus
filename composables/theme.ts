export type ThemeType = "light" | "dark";
export type PaletteType = "pink" | "cyan" | "green" | "orange" | "purple" | "red" | "yellow" | "custom";

class ThemeClass {
	get #htmlData() { return document.documentElement.dataset; }
	get #isSystemDark() { return window.matchMedia("(prefers-color-scheme: dark)").matches; }

	set theme(value: ThemeType) {
		if (!process.client) return;
		this.#htmlData.theme = value;
	}

	get theme() {
		if (!process.client) return "light";
		return this.#htmlData.theme as ThemeType ?? (this.#isSystemDark ? "dark" : "light");
	}

	set palette(value: PaletteType) {
		if (!process.client) return;
		this.#htmlData.palette = value;
	}

	get palette() {
		if (!process.client) return "pink";
		return this.#htmlData.palette as PaletteType ?? "pink";
	}

	init() {
		this.theme = this.theme;
		this.palette = this.palette;
	}
}

export const Theme = new ThemeClass();

// TODO: 应该使用 useLocalStorage 或 middleware 解决，这不是正确的解决方案。
