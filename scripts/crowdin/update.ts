import { readFile, readdir } from "fs/promises";
import { resolve } from "path";
import consoleColors from "../console-colors";
import { sourceFilesApi, uploadStorageApi } from "./crowdin";
import { projectId } from "./token";

const __dirname = import.meta.dirname;
const SOURCE_LANGUAGE = "English";

async function updateFile(projectId: number, fileName: string, fileContent: string) {
	const filesResponse = await sourceFilesApi.listProjectFiles(projectId);
	const files = filesResponse.data.map(file => file.data);
	const file = files.find(file => file.name === fileName);
	if (!file) throw new Error(`Could not find file ${fileName}`);

	const storageResponse = await uploadStorageApi.addStorage(fileName, fileContent);

	await sourceFilesApi.updateOrRestoreFile(projectId, file.id, {
		storageId: storageResponse.data.id,
	});
}

const file = await (async () => {
	let path = __dirname;
	while (true) {
		const files = await readdir(path);
		if (path === resolve(path, "/")) throw new Error("Could not find project path");
		if (files.includes("src")) break;
		path = resolve(path, "..");
	}
	return resolve(path, `src/locales/${SOURCE_LANGUAGE}.ts`);
})();
const fileContent = await readFile(file, "utf-8");

updateFile(projectId, `${SOURCE_LANGUAGE}.json`, fileContent);
console.log(consoleColors.foreground.green + "Update successfully!" + consoleColors.reset);
