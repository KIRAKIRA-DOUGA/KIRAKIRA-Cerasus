
import * as api from "kirakirabackend";

/** convenience singleton for the OpenAPI SDK
 * @returns: DefaultAPI
*/
export function API(): DefaultApi {
	const configParams = {
		baseServer: api.servers[0],
	};
	const config = api.createConfiguration(configParams);

	return new api.DefaultApi(config);
}
