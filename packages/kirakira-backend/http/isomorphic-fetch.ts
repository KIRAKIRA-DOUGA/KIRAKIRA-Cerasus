import { HttpLibrary, RequestContext, ResponseContext } from "./http";
import { from, Observable } from "../rxjsStub";
import "whatwg-fetch";

export class IsomorphicFetchHttpLibrary implements HttpLibrary {

	public send(request: RequestContext): Observable<ResponseContext> {
		const method = request.getHttpMethod().toString();
		const body = request.getBody();
		const url = request.getUrl();
		// if ((process as any).server) url = url.replace(/\w*:\/\/.*?\//, "https://kirakira.dev/");

		const resultPromise = fetch(url, {
			method,
			body,
			headers: request.getHeaders(),
			credentials: "same-origin",
		}).then((resp: any) => {
			const headers: Record<string, string> = {};
			resp.headers.forEach((value: string, name: string) => {
				headers[name] = value;
			});

			const body = {
				text: () => resp.text(),
				binary: () => resp.blob(),
			};
			return new ResponseContext(resp.status, headers, body);
		});

		return from<Promise<ResponseContext>>(resultPromise);
	}
}
