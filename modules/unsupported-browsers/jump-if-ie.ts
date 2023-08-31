import { UNSUPPORTED_ROUTE } from "./constants.ts";

if (window.ActiveXObject || "ActiveXObject" in window) {
	const IE_PAGE_URL = UNSUPPORTED_ROUTE;
	const lang = document.documentElement.lang;
	const currentPage = encodeURIComponent(location.href);
	location.href = IE_PAGE_URL + `?lang=${lang}&next=${currentPage}`;
}
