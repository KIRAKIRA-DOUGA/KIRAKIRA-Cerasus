/* eslint-disable require-jsdoc */

const langs = [
	{ file: "Chinese Simplified", name: "简体中文", lang: "zh-Hans-CN" },
	{ file: "Chinese Traditional", name: "繁體中文", lang: "zh-Hant-TW" },
	{ file: "English", name: "English", lang: "en" },
	{ file: "Japanese", name: "日本語", lang: "ja" },
	{ file: "Korean", name: "한국인", lang: "ko" },
	{ file: "Vietnamese", name: "Tiếng Việt", lang: "vi" },
	{ file: "Indonesian", name: "Bahasa Indo", lang: "id" },
];

const table = document.getElementById("table") as HTMLTableElement;
const insertBeforeBtn = document.getElementById("insert-before") as HTMLButtonElement;
const insertAfterBtn = document.getElementById("insert-after") as HTMLButtonElement;
const appendChildBtn = document.getElementById("append-child") as HTMLButtonElement;
const removeBtn = document.getElementById("remove") as HTMLButtonElement;
const refreshBtn = document.getElementById("refresh") as HTMLButtonElement;
const editStringModalEl = document.getElementById("edit-string-modal") as HTMLDivElement;
const editStringModal = new bootstrap.Modal(editStringModalEl);
const editStringTextArea = document.getElementById("edit-string-textarea") as HTMLTextAreaElement;
const editStringOkBtn = document.getElementById("edit-string-ok") as HTMLButtonElement;

async function refresh() {
	const response = await fetch("/get");
	const data = await response.json() as NestedLocaleData;
	while (table.hasChildNodes())
		table.removeChild(table.lastChild!);
	putDataToTable(data);
	return data;
}
await refresh();

function putDataToTable(data: NestedLocaleData) {
	const thead = document.createElement("thead");
	const tbody = document.createElement("tbody");
	table.append(thead);
	table.append(tbody);
	const keyTh = document.createElement("th");
	keyTh.innerText = "Key";
	thead.append(keyTh);
	for (const { name, lang } of langs) {
		const th = document.createElement("th");
		th.innerText = name;
		th.lang = lang;
		thead.append(th);
	}
	const schinese = "Chinese Simplified";
	const schineseLang = langs.find(lang => lang.file === schinese)!.lang;
	for (const [key, value] of Object.entries(data[schinese])) {
		if (typeof value !== "string") continue;
		const tr = document.createElement("tr");
		const keyTd = document.createElement("td");
		const valueTd = document.createElement("td");
		keyTd.innerText = key;
		valueTd.innerText = value;
		valueTd.lang = schineseLang;
		tr.append(keyTd);
		tr.append(valueTd);
		tbody.append(tr);
		for (const { file, lang } of langs) {
			if (file === schinese) continue;
			const locale = data[file] as NestedLocaleData | undefined;
			if (!locale) continue;
			const value = locale[key] as string;
			const td = document.createElement("td");
			td.innerText = value;
			td.lang = lang;
			tr.append(td);
		}
	}
}

refreshBtn.addEventListener("click", refresh);

document.addEventListener("click", e => {
	if (!(e.target instanceof HTMLTableCellElement)) return;
	const ACTIVE_CLASS = "table-active";
	document.querySelectorAll<HTMLTableCellElement>(`td.${ACTIVE_CLASS}`).forEach(el =>
		el.classList.remove(ACTIVE_CLASS));
	const td = e.target;
	td.classList.add(ACTIVE_CLASS);
});

let currentTd: HTMLTableCellElement | undefined;

document.addEventListener("dblclick", e => {
	if (!(e.target instanceof HTMLTableCellElement)) return;
	currentTd = e.target;
	editStringTextArea.value = currentTd.innerText;
	editStringModal.show();
});

editStringModalEl.addEventListener("hide.bs.modal", () => {
	currentTd = undefined;
});

editStringOkBtn.addEventListener("click", () => {
	if (currentTd) currentTd.innerText = editStringTextArea.value;
	editStringModal.hide();
});
