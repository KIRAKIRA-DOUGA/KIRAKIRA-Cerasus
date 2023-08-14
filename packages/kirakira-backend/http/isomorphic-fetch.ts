import { HttpLibrary, RequestContext, ResponseContext } from "./http";
import { from, Observable } from "../rxjsStub";
import { environment } from "../../../utils/environment";
import "whatwg-fetch";

export class IsomorphicFetchHttpLibrary implements HttpLibrary {

	public send(request: RequestContext): Observable<ResponseContext> {
		let method = request.getHttpMethod().toString();
		let body = request.getBody();
		let url = request.getUrl();
		if (environment.server) url.replace(/\w*:\/\/.*?\//, "https://kirakira.dev/");

		const resultPromise = fetch(url, {
			method: method as any,
			body: body as any,
			headers: request.getHeaders(),
			credentials: "same-origin"
		}).then((resp: any) => {
			const headers: { [name: string]: string } = {};
			resp.headers.forEach((value: string, name: string) => {
				headers[name] = value;
			});

			const body = {
				text: () => resp.text(),
				binary: () => resp.blob()
			};
			return new ResponseContext(resp.status, headers, body);
		});

		return from<Promise<ResponseContext>>(resultPromise);
	}
}
