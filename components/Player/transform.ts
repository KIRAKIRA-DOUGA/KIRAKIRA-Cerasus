// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
export default function urlToBlob(url: string, callback:Function) {
	const xhr = new XMLHttpRequest();
	xhr.open("get", url, true);
	xhr.responseType = "blob";
	xhr.onload = function () {
		if (this.status === 200 && callback)
			callback(this.response);
	};
	xhr.send();
}
