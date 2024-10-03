/**
 * 将一个字符串转换为 TXT 文件，并弹出下载
 * @param content 文件中的内容
 * @param fileName 文件名，最长 200 ***字节*** // WARN 不要提供扩展名，会自动在结尾拼接“.txt”
 */
export function downloadTxtFileFromString(content: string, fileName: string) {
	// 文件名长度验证
	if (encodeURIComponent(fileName).split(/%..|./).length - 1 > 200) {
		console.error("ERROR", "文件名的字节数不能超过 200")
		return;
	}

	// 创建 Blob 对象
	const blob = new Blob([content], { type: 'text/plain' });

	// 创建一个链接元素
	const link = document.createElement('a');

	// 创建下载链接
	link.href = URL.createObjectURL(blob);
	link.download = `${fileName}.txt`;  // 设置下载的文件名

	// 模拟点击链接，触发下载
	link.click();

	// 释放 URL 对象
	URL.revokeObjectURL(link.href);
}
