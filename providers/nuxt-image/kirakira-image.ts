import { joinURL, encodeQueryItem } from "ufo";
import type { ProviderGetImage } from "./types";
import { createOperationsGenerator } from "#image";

const operationsGenerator = createOperationsGenerator({
	keyMap: {
		width: "w",
		height: "h",
		dpr: "dpr",
		fit: "fit",
		gravity: "g",
		quality: "q",
		format: "f",
		sharpen: "sharpen",
		blur: "blur",
	},
	valueMap: {
		fit: {
			cover: "cover",
			contain: "contain",
			fill: "scale-down",
			outside: "crop",
			inside: "pad",
		},
		gravity: {
			auto: "auto",
			side: "side",
		},
	},
	joinWith: ",",
	formatter: (key: string, val: string) => encodeQueryItem(key, val),
});

const defaultModifiers = {};

// https://developers.cloudflare.com/images/image-resizing/url-format/
export const getImage: ProviderGetImage = (src, {
	modifiers = {},
	baseURL = "/",
	accountHash = "",
} = {}) => {
	const mergeModifiers = { ...defaultModifiers, ...modifiers };
	const operations = operationsGenerator(mergeModifiers as Record<string, string>);

	// https://<ZONE>/cdn-cgi/image/<ACCOUNT-HASH>/<SOURCE-IMAGE>/<OPTIONS>
	const url = operations ? joinURL(baseURL, "cdn-cgi/imagedelivery", accountHash, src, operations) : joinURL(baseURL, "cdn-cgi/imagedelivery", accountHash, src, "w=3840");

	return {
		url,
	};
};
