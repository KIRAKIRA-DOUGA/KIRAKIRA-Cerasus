if (window.ActiveXObject || "ActiveXObject" in window) {
	const IE_PAGE_URL = "/unsupported?next=";
	const currentPage = encodeURIComponent(location.href);
	location.href = IE_PAGE_URL + currentPage;
}
