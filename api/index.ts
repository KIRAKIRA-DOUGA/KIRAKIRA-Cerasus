export const postData = async (url: string, data: object) => {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data), // 将对象序列化为字符串
	});

	return response.json(); // 解析为 JSON 格式
};

export const putData = async (url: string, data: object) => {
	const response = await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data), // 将对象序列化为字符串
	});

	return response.json(); // 解析为 JSON 格式
};
