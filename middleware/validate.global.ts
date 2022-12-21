export default defineNuxtRouteMiddleware((to, from) => {
	console.log("to", to, "\nfrom", from);
	const path = to.path.slice(1);
	if (path === "abort")
		return abortNavigation();
	// return navigateTo("/");
});
