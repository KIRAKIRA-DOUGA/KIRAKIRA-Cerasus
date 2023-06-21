export const useHistoryKaomoji = defineStore("historyKaomji", {
	state: () => ({
		showCssDoodle: false,
		kaomojis: ["(╯￣Д￣)╯╘═╛ ", " (ノ=Д=)ノ┻━┻ ", "（╯#-皿-)╯~~╧═╧", "(╯’ – ‘)╯︵ ┻━┻"],
	}),
	persist: true,
});
