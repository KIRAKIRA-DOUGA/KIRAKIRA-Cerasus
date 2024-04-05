import extract from "extract-zip";
import { createWriteStream, existsSync } from "fs";
import { copyFile, mkdir, readdir, rm, stat } from "fs/promises";
import https from "https";
import { tmpdir } from "os";
import { join, resolve } from "path";
import consoleColors from "../console-colors";
import { translationsApi } from "./crowdin";
import { projectId } from "./token";

const __dirname = import.meta.dirname;

async function getDownloadTranslationsUrl(projectId: number) {
	const result = await translationsApi.buildProject(projectId);

	let status = result.data.status;
	while (status !== "finished") {
		const progress = await translationsApi.checkBuildStatus(projectId, result.data.id);
		status = progress.data.status;
	}

	const translations = await translationsApi.downloadTranslations(projectId, result.data.id);

	return translations.data.url;
}

async function downloadFile(url: string, filePath: string) {
	const file = createWriteStream(filePath);
	await new Promise<void>(resolve =>
		https.get(url, response => {
			response.pipe(file);
			file.on("finish", resolve);
		}));
	file.close();
}

async function extractZip(source: string, target: string) {
	await extract(source, { dir: target });
}

async function mergeFolders(sourceFolder: string, targetFolder: string) {
	if (!existsSync(targetFolder))
		await mkdir(targetFolder, { recursive: true });

	const files = await readdir(sourceFolder);
	for (const file of files) {
		const sourcePath = join(sourceFolder, file);
		const targetPath = join(targetFolder, file);
		const stats = await stat(sourcePath);

		if (stats.isFile())
			await copyFile(sourcePath, targetPath);
		else if (stats.isDirectory()) {
			if (!existsSync(targetPath))
				await mkdir(targetPath, { recursive: true });
			mergeFolders(sourcePath, targetPath);
		}
	}
}

async function moveLocaleFiles(extractedPath: string, projectFolderName: string) {
	let path = extractedPath;
	while (true) {
		const files = await readdir(path);
		if (!files.length) throw new Error(`Could not find any files in ${path}`);
		path = resolve(path, files[0]);
		if (files[0] === projectFolderName) break;
	}
	let projectPath = __dirname;
	while (true) {
		const files = await readdir(projectPath);
		if (projectPath === resolve(projectPath, "/")) throw new Error("Could not find project path");
		if (files.includes(projectFolderName)) {
			projectPath = resolve(projectPath, projectFolderName);
			break;
		}
		projectPath = resolve(projectPath, "..");
	}
	await mergeFolders(path, projectPath);
}

const downloadUrl = await getDownloadTranslationsUrl(projectId);
const filePath = resolve(tmpdir(), "l10n.zip");
await downloadFile(downloadUrl, filePath);
const extractedPath = resolve(tmpdir(), "l10n");
await extractZip(filePath, extractedPath);
await moveLocaleFiles(extractedPath, "Web");
const remove = (path: string) => rm(path, { recursive: true, force: true });
await Promise.all([
	remove(filePath),
	remove(extractedPath),
]);
console.log(consoleColors.foreground.green + "Download successfully!" + consoleColors.reset);
