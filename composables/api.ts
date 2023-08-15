import * as api from "kirakira-backend";

/**
 * convenience singleton for the OpenAPI SDK
 * @todo make it an actual singleton lol
 * @returns DefaultAPI
 */
export function useApi() {
	const runtimeConfig = useRuntimeConfig();
	const siteUrl = runtimeConfig.public.siteUrl;
	const { host } = new URL(siteUrl);

	const configParams = {
		baseServer: api.getServers(host)[0],
	};
	const config = api.createConfiguration(configParams);

	return new api.DefaultApi(config);
}
