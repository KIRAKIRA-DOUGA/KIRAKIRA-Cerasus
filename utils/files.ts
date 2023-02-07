/**
 * 将 URL 地址转换为 blob 对象。
 * @param url - 链接。
 * @param callback - 回调函数。
 */
export function urlToBlob(url: string, callback: (blob: Blob) => void) {
	const xhr = new XMLHttpRequest();
	xhr.open("get", url, true);
	xhr.responseType = "blob";
	xhr.onload = function () {
		if (this.status === 200 && callback)
			callback(this.response);
	};
	xhr.send();
}
