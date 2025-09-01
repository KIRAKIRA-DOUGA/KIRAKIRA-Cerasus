/**
 * 将 URL 地址转换为 blob 对象。
 * @deprecated XMLHttpRequest 这种上古技术还有使用的必要吗？
 * @param url - 链接。
 * @param callback - 回调函数。
 */
export function urlToBlob_legacy(url: string, callback: (blob: Blob) => void) {
	const xhr = new XMLHttpRequest();
	xhr.open("get", url, true);
	xhr.responseType = "blob";
	xhr.onload = function () {
		if (this.status === 200 && callback)
			callback(this.response);
	};
	xhr.send();
}

/**
 * 文件转 Blob: 链接。
 * @param file - 文件。
 * @returns Blob: 链接。
 */
export async function fileToBlob(file: File | Blob) {
	if (file instanceof FileSystemFileHandle) file = await file.getFile();
	const blob = URL.createObjectURL(file);
	return blob;
}

/**
 * 文件转 Data: Base64 链接。
 * @param file - 文件。
 * @returns Data: Base64 链接。
 */
export function fileToData(file: File) {
	return new Promise<string>(resolve => {
		const fileReader = new FileReader();
		fileReader.onload = function () { resolve(this.result as string); };
		fileReader.readAsDataURL(file);
	});
}
/**
 * Data: Base64 链接转 Blob 文件。
 * @param dataUrl - Data: Base64 链接。
 * @param fileName - 文件名，可选。
 * @returns Blob 文件。
 */
export function dataToFile(dataUrl: string, fileName?: string) {
	const mimeAndBytes = dataUrl.split(",") as [string, string];
	const mime = mimeAndBytes[0].match(/:(.*?);/)![1];
	const byteString = atob(mimeAndBytes[1]);
	let n = byteString.length;
	const bytes = new Uint8Array(n);
	while (n--)
		// eslint-disable-next-line unicorn/prefer-code-point
		bytes[n] = byteString.charCodeAt(n);
	return fileName != null ?
		new File([bytes], fileName, { type: mime }) :
		new Blob([bytes], { type: mime }) as File;
}

/**
 * 下载文件。
 * @param url - 链接地址。
 * @param filename - 欲保存的文件名。
 */
export async function downloadFile(url: string | Blob, filename: string = "") {
	const blob = await (async () => {
		if (typeof url === "string")
			return await fetch(url).then(async res => await res.blob());
		else return url;
	})();

	const a = document.createElement("a");
	a.style.display = "none";
	a.href = URL.createObjectURL(blob);
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(a.href);
}

/**
 * 将一个字符串转换为 TXT 文件，并弹出下载
 * @param content - 文件中的内容
 * @param fileName - 文件名，最长 200 ***字节***。
 */
export async function downloadTxtFileFromString(content: string, fileName: string) {
	// 文件名长度验证
	if (encodeURIComponent(fileName).split(/%..|./).length - 1 > 200) {
		console.error("ERROR", "文件名的字节数不能超过 200");
		return;
	}
	const blob = new Blob([content], { type: "text/plain" });
	if (!fileName.endsWith(".txt")) fileName += ".txt";
	await downloadFile(blob, fileName);
}

/**
 * 打开文件选择器对话框并返回选中文件的 `File` 对象。
 *
 * @returns 代表所选文件的单个文件对象。如果未选择文件，返回 `null`。
 */
export async function openFile(options?: {
	/** 指定要接受的文件类型的字符串，例如：.jpg,.png,image/*。 */
	accept?: string;
	/** 指定是否允许选择多个文件？ */
	multiple?: false;
}): Promise<File | null>;
/**
 * 打开文件选择器对话框并返回选中文件的 `File[]` 对象。
 *
 * @returns 代表所选文件的文件对象数组。
 */
export async function openFile(options?: {
	/** 指定要接受的文件类型的字符串，例如：.jpg,.png,image/*。 */
	accept?: string;
	/** 指定是否允许选择多个文件？ */
	multiple: true;
}): Promise<File[]>;
export async function openFile({ accept = "", multiple = false } = {}): Promise<File | File[] | null> {
	// `showOpenFilePicker` 更好，但是它不支持所有浏览器以及 **TypeScript**。
	const input = document.createElement("input");
	input.type = "file";
	input.accept = accept;
	input.multiple = multiple;
	await new Promise<void>(resolve => {
		input.onchange = () => resolve();
		input.click();
	});
	const files = await Array.fromAsync(input.files ?? [], async file => file instanceof FileSystemFileHandle ? await file.getFile() : file);
	if (multiple) return files;
	else return files[0] ?? null;
}
