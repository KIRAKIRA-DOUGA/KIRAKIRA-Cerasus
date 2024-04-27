export default defineNuxtRouteMiddleware(async (to, from) => {
	try {
		await cookieBaker();
	} catch (error) {
		console.error("ERROR", "烘焙网络曲奇☆时发生了意料外的错误：", error);
		if (from.path !== "/")
			navigateTo("/");
	}
});
