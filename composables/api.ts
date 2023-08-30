import * as api from "kirakira-backend";

/**
 * convenience singleton for the OpenAPI SDK.
 * @returns DefaultAPI.
 */
export function useApi() {
	const host = getHost();

	const configParams = {
		baseServer: api.getServers(host)[0],
	};

	api.changeFetch(useFetch);

	const config = api.createConfiguration(configParams);

	return new api.DefaultApi(config);
}
