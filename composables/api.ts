import * as api from "kirakira-backend";

/**
 * convenience singleton for the OpenAPI SDK
 * TODO make it an actual singleton lol
 * @returns: DefaultAPI
 */
export function useApi(): DefaultApi {
	const configParams = {
		baseServer: api.servers[0],
	};
	const config = api.createConfiguration(configParams);

	return new api.DefaultApi(config);
}
