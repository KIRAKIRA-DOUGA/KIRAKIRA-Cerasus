export const useHistoryKaomoji = defineStore("historyKaomoji", {
	state: () => ({
		kaomojis: ["(╯￣Д￣)╯╘═╛ ", " (ノ=Д=)ノ┻━┻ ", "（╯#-皿-)╯~~╧═╧", "(╯’ – ‘)╯︵ ┻━┻"],
	}),
	persist: true,
});
