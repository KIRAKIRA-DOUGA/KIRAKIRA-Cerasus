/* eslint-disable @typescript-eslint/no-explicit-any */

import { IncomingMessage, ServerResponse } from "http";

declare global {
	type ServerHandler = (request: IncomingMessage, response: ServerResponse) => boolean | void;
	type NestedLocaleData = {
		[key: string]: string | NestedLocaleData;
	};
	const bootstrap: any;
}

export { };
