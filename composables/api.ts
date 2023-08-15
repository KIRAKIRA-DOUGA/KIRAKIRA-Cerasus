import * as api from "kirakira-backend";

const apiSingleton = ref<api.DefaultApi>();

/**
 * convenience singleton for the OpenAPI SDK.
 * @returns DefaultAPI.
 */
export function useApi() {
	if (apiSingleton.value) return apiSingleton.value;

	const nuxtApp = useNuxtApp();
	const host = process.server ? nuxtApp.ssrContext!.event.node.req.headers.host! : window.location.host;

	const configParams = {
		baseServer: api.getServers(host)[0],
	};
	const config = api.createConfiguration(configParams);

	apiSingleton.value = new api.DefaultApi(config);
	return apiSingleton.value;
}
