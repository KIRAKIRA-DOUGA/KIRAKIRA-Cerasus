import { readFile, readdir } from "fs/promises";
import { resolve } from "path";
import consoleColors from "../console-colors";
import { sourceFilesApi, uploadStorageApi } from "./crowdin";
import { projectId } from "./token";

const SOURCE_LANGUAGE = "English";

async function updateFile(projectId: number, fileName: string, fileContent: string) {
	const filesResponse = await sourceFilesApi.listProjectFiles(projectId);
	const files = filesResponse.data.flatMap(file => file.data);
	const file = files.find(file => file.name === fileName && file.path.includes("KIRAKIRA-Cerasus"));
	if (!file) throw new Error(`Could not find file ${fileName}`);

	const storageResponse = await uploadStorageApi.addStorage(fileName, fileContent);

	await sourceFilesApi.updateOrRestoreFile(projectId, file.id, {
		storageId: storageResponse.data.id,
	});
}

const file = await (async () => {
	let path = import.meta.dirname;
	while (true) {
		const files = await readdir(path);
		if (path === resolve(path, "/")) throw new Error("Could not find project path");
		if (files.includes("i18n")) {
			const i18nFiles = await readdir(resolve(path, "i18n"));
			if (i18nFiles.includes("locales")) break;
		}
		path = resolve(path, "..");
	}
	return resolve(path, `i18n/locales/${SOURCE_LANGUAGE}.ts`);
})();
const fileContent = await readFile(file, "utf-8");

await updateFile(projectId, `${SOURCE_LANGUAGE}.json`, fileContent);
console.log(consoleColors.foreground.green + "Update successfully!" + consoleColors.reset);
console.log("Please visit to start translation: " + consoleColors.foreground.blue + "https://crowdin.com/project/kirakira" + consoleColors.reset);
