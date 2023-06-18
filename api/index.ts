export const postData = async (url: string, data: object) => {
	const response = await fetch(url, {
		method: "POST", // 或者 "PUT"
		headers: {
			"Content-Type": "application/json",
			// "Content-Type": "application/x-www-form-urlencoded",
		},
		body: JSON.stringify(data), // 将数据转换成字符串
	});

	return response.json(); // 解析为 JSON 格式
};
