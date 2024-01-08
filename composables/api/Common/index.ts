type RequestObject = Record<string, string>;
type HeadersObject = Record<string, string>;

/**
 * 带有超时停止的 fetch
 * @param resource 请求的目标
 * @param options 请求中附带的内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请求结果
 */
async function fetchWithTimeout(resource: RequestInfo, options: RequestInit = {}, timeout = 30000) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(resource, {
		...options,
		signal: controller.signal,
	});

	clearTimeout(id);

	if (!response.ok)
		throw new Error(`HTTP error! Status: ${response.status}`);

	return response;
}

/**
 * 发送 GET 请求
 * @param url 请求的网址
 * @param requestOptions 请求携带的请求标头
 * @param headerOptions 请求携带的 Header 内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请取结果
 */
export async function GET(url: string, requestOptions: RequestObject = {}, headerOptions: HeadersObject = {}, timeout?: number): Promise<unknown> {
	try {
		const response = await fetchWithTimeout(url, {
			method: "GET",
			...requestOptions,
			headers: headerOptions,
		}, timeout);
		return response.json();
	} catch (error) {
		console.error("ERROR", `something wrong in 'GET', URL: ${url}`, error); // TODO: Remove Console Output?
		throw error;
	}
}

/**
 * 发送 POST 请求
 * @param url 请求的网址
 * @param body 请求的 body 内容
 * @param requestOptions 请求携带的请求标头
 * @param headerOptions 请求携带的 Header 内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请求结果
 */
export async function POST(url: string, body: unknown, requestOptions: RequestObject = {}, headerOptions: HeadersObject = {}, timeout?: number): Promise<unknown> {
	try {
		const response = await fetchWithTimeout(url, {
			method: "POST",
			...requestOptions,
			headers: {
				"Content-Type": "application/json",
				...headerOptions,
			},
			body: JSON.stringify(body),
		}, timeout);
		return response.json();
	} catch (error) {
		console.error("ERROR", `something wrong in 'POST', URL: ${url}`, error); // TODO: Remove Console Output?
		throw error;
	}
}

/**
 * 发送 DELETE 请求
 * @param url 请求的网址
 * @param body 请求的 body 内容
 * @param requestOptions 请求携带的请求标头
 * @param headerOptions 请求携带的 Header 内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请求结果
 */
export async function DELETE(url: string, body: unknown, requestOptions: RequestObject = {}, headerOptions: HeadersObject = {}, timeout?: number): Promise<unknown> {
	try {
		const response = await fetchWithTimeout(url, {
			method: "DELETE",
			...requestOptions,
			headers: {
				"Content-Type": "application/json",
				...headerOptions,
			},
			body: JSON.stringify(body),
		}, timeout);
		return response.json();
	} catch (error) {
		console.error("ERROR", `something wrong in 'DELETE', URL: ${url}`, error); // TODO: Remove Console Output?
		throw error;
	}
}

/**
 * 发送 PUT 请求向 R2 上传文件
 * @param signedUrl R2 用于上传文件的预编译 URL
 * @param body 上传的文件的 Blob
 * @param contentType 请求负载的数据的媒体类型，例如：'application/json', 'image/png' 等。详细的 Content-Type 请参照本文件最下方的注释
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请求结果，上传成功 true，否则 false
 */
export async function uploadFile2R2(signedUrl: string, body: Blob, contentType: string, timeout?: number): Promise<void> {
	try {
		await fetchWithTimeout(signedUrl, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": contentType,
				"Access-Control-Allow-Origin": "*",
			},
			body,
		}, timeout);
	} catch (error) {
		console.error("ERROR", `something wrong in 'uploadFile2R2', URL: ${signedUrl}`, error); // TODO: Remove Console Output?
		throw error;
	}
}

// 以下为典型的 Content-Type HTTP 标头
//
// 文本格式:
// text/html: 用于 HTML 文档。
// text/plain: 纯文本文件。
// text/css: CSS 样式表。
// text/javascript: JavaScript 代码。
//
// 图像格式:
// image/jpeg: JPEG 图像。
// image/png: PNG 图像。
// image/gif: GIF 图像。
// image/svg+xml: SVG 矢量图像。
//
// 应用程序和文档格式:
// application/json: JSON 数据格式。
// application/xml: XML 数据格式。
// application/pdf: PDF 文档。
// application/msword: Microsoft Word 文档。
// application/vnd.ms-excel: Microsoft Excel 文档。
//
// 音频和视频格式:
// audio/mpeg: MP3 音频。
// audio/ogg: Ogg 音频。
// video/mp4: MP4 视频。
// video/x-msvideo: AVI 视频。
//
// 其他格式:
// application/octet-stream: 任意的二进制数据。
// multipart/form-data: 用于表单数据，尤其是包含文件上传时。
