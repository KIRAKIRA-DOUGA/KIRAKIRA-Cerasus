import { Theme } from "./composables";
import script from "./script";
import { NuxtColorMode } from "./types";

const systemDark = () => window.matchMedia("(prefers-color-scheme: dark)");
const setMetaThemeColor = () => Theme.meta.value = useCssVar("--accent").value;

/**
 * 监测主题色变化而更新。
 */
function update() {
	const theme = Theme.theme.value, palette = Theme.palette.value;
	let actualTheme = theme;
	if (theme === "system") actualTheme = systemDark().matches ? "dark" : "light";
	document.documentElement.className = palette;
	if (actualTheme === "dark") document.documentElement.classList.add(actualTheme);
	setMetaThemeColor();
	const colorMode: NuxtColorMode = { theme, palette };
	window.localStorage.setItem("nuxt-color-mode", JSON.stringify(colorMode));
}

export default defineNuxtPlugin(nuxt => {
	nuxt.hook("app:mounted", () => {
		const colorMode = script(false);
		Theme.theme.value = colorMode.theme;
		Theme.palette.value = colorMode.palette;

		watch([Theme.theme, Theme.palette], update);
		systemDark().addEventListener("change", update);
		setMetaThemeColor();
	});
});
