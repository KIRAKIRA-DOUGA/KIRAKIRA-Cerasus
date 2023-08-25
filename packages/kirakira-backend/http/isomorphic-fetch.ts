import "whatwg-fetch";
import { Observable, from } from "../rxjsStub";
import { HttpLibrary, RequestContext, ResponseContext } from "./http";


export var fetch: any;

export function changeFetch(f: any) {
	fetch = f;
}

export class IsomorphicFetchHttpLibrary implements HttpLibrary {

	public send(request: RequestContext): Observable<ResponseContext> {
		const method = request.getHttpMethod().toString();
		const body = request.getBody();
		const url = request.getUrl();

		const resultPromise = fetch(url, {
			method,
			body,
			headers: request.getHeaders(),
			credentials: "same-origin",
		}).then((data: any) => {
			const body = {
				text: async () => JSON.stringify(data.data._value),
				binary: async () => {
					return new Blob([JSON.stringify(data.data._value)], {
						type: "application/json",
					});
			},
			};
			return new ResponseContext(200, { "content-type": "application/json" }, body);
		});

		return from<Promise<ResponseContext>>(resultPromise);
	}
}
