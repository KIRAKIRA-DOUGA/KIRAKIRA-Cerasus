import { IncomingMessage, ServerResponse } from "http";

declare global {
	type ServerHandler = (request: IncomingMessage, response: ServerResponse) => boolean | void;
}

export { };
