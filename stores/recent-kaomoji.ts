export const useRecentKaomojiStore = defineStore("recent-kaomoji", () => {
	const max = ref(4);
	const kaomojis = reactive(["(╯￣Д￣)╯╘═╛ ", " (ノ=Д=)ノ┻━┻ ", "（╯#-皿-)╯~~╧═╧", "(╯’ – ‘)╯︵ ┻━┻"]);
	
	/**
	 * 添加颜文字到最近中。
	 * @param kaomoji - 最近选择的颜文字。
	 */
	function add(kaomoji: string) {
		kaomojis.unshift(kaomoji);
		arrayInject(kaomojis, [...new Set(kaomojis)].slice(0, max.value));
	}
	
	return { max, kaomojis, add };
}, { persist: true });
