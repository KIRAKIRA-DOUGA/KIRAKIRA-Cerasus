if (window.ActiveXObject || "ActiveXObject" in window) {
	const IE_PAGE_URL = "/601.html?next="; // "/error/601?next=";
	const currentPage = encodeURIComponent(location.href);
	location.href = IE_PAGE_URL + currentPage;
}
