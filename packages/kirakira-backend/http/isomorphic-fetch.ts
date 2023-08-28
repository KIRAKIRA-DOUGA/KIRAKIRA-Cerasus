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
		const headers: { [name: string]: string } = {};
		headers["content-type"] = "application/json";
		var status = 200;
		const resultPromise = fetch(url, {
			method,
			body,
			headers: request.getHeaders(),
			credentials: "same-origin",
			async onResponse ({ request, response, options }) {
				response.headers.forEach((value, key) => {
					headers[key] = value;
				});
				status = response.status;

			},
		}).then((data: any) => {
			const body = {
				text: async () => JSON.stringify(data.data._value),
				binary: async () => {
					return new Blob([JSON.stringify(data.data._value)], {
						type: "application/json",
					});
				},
			};

			console.log(headers);
			return new ResponseContext(status, headers, body);
		});


		// const myPromise = new Promise(async (resolve, reject) => {
		// 	console.log("PROMISE");
		// 	var r = fetch(url, {
		// 		method,
		// 		body,
		// 		headers: request.getHeaders(),
		// 		credentials: "same-origin",
		// 		async onResponse ({ request, response, options }) {
		// 			 console.log("OnResponse");
		// 			// (screaming)
		// 			console.log(await response.text());
		// 			resolve(response);
		// 		 },
		// 		 async OnErrorResponse({ request, response, options }) {
		// 			 // (screaming)
		// 			 console.log("ERROR");
		// 			 reject(response);
		// 		 },
		// 	}).catch((error: any) => console.error(error));

		// }).then(async (response: any) => {
		// 	const status = response.status;

		// 	const t = await response.text();
		// 	console.log(t);


		// 	const body = {
		// 		text:  () => t,
		// 		binary: async () => {
		// 			return new Blob([JSON.stringify(JSON.parse(t), null, 2)], {
		// 				type: "application/json",
		// 			})
		// 		}
		// 	};

		// 	return new ResponseContext(status, headers, body);
		// }).catch((error: any) => console.error(error));

		return from<Promise<ResponseContext>>(resultPromise);
	}
}
