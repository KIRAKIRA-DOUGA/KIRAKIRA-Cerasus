/* eslint-disable */

/**
 * @param {Record<string, string | Record<string, string>>} object
 * @param {string[]} prefix
 */
function flattenObject(object, prefix = []) {
	/** @type Record<string, string> */
	const newObject = {};
	for (const [key, value] of Object.entries(object)) {
		const newKey = key === "_" ? prefix : [...prefix, key];
		if (typeof value === "object")
			Object.assign(newObject, flattenObject(value, newKey));
		else
			newObject[newKey.join("_")] = value;
	}
	return newObject;
}

/**
 * @param {Record<string, string | Record<string, string>>} template
 * @param {Record<string, string | Record<string, string>>} target
 * @param {string[]} prefix
 */
function refactorI18n(template, target, prefix = []) {
	const newI18n = JSON.parse(JSON.stringify(template));
	target = flattenObject(target);
	for (const key in newI18n) {
		const value = newI18n[key];
		const flatKey = key === "_" ? prefix : [...prefix, key];
		if (typeof value === "object")
			newI18n[key] = refactorI18n(value, target, flatKey);
		else {
			const snakeKey = flatKey.join("_");
			if (target[snakeKey]) newI18n[key] = target[snakeKey];
		}
	}
	return newI18n;
}

function log(object) {
	const string = JSON.stringify(object, undefined, "\t").replaceAll(/\t"(.*?)": /g, "\t$1: ").replaceAll(/(?=\n\t*})/g, ",");
	console.log(string);
}
