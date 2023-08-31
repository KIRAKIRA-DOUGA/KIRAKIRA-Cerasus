import { UNSUPPORTED_ROUTE } from "./constants";

if (window.ActiveXObject || "ActiveXObject" in window) {
	const IE_PAGE_URL = UNSUPPORTED_ROUTE;
	let lang = document.documentElement.lang;
	if (lang === "zhs") lang = "zh-cmn-Hans-CN";
	const currentPage = encodeURIComponent(location.href);
	location.href = IE_PAGE_URL + `?lang=${lang}&next=${currentPage}`;
}
