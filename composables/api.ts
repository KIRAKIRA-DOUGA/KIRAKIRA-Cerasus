import * as api from "kirakira-backend";

const apiSingleton = ref<api.DefaultApi>();

/**
 * convenience singleton for the OpenAPI SDK.
 * @returns DefaultAPI.
 */
export function useApi() {
	const runtimeConfig = useRuntimeConfig();
	const siteUrl = runtimeConfig.public.siteUrl;
	const { host } = new URL(siteUrl);

	const configParams = {
		baseServer: api.getServers(host)[0],
	};

	api.changeFetch(useFetch);

	const config = api.createConfiguration(configParams);

	return new api.DefaultApi(config);
}
