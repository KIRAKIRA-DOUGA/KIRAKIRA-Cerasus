export const useShortcutKeysStore = defineStore("ShortcutKeys", () => {
	const allowShortcutKeys = ref(true);

	/**
	 * 是否允许使用快捷键。
	 * @param value - 是否允许使用快捷键。
	 */
	function setAllowShortcutKeys(value: boolean) {
		allowShortcutKeys.value = value;
	}

	return { setAllowShortcutKeys, allowShortcutKeys };
});
