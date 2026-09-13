import { createWriteStream, existsSync } from "fs";
import { copyFile, mkdir, readdir, rm, stat } from "fs/promises";
import https from "https";
import { tmpdir } from "os";
import { join, resolve } from "path";
import extract from "extract-zip";
import consoleColors from "../console-colors";
import { translationsApi } from "./crowdin";
import { projectId } from "./token";

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
		if (!existsSync(sourcePath)) continue;
		const stats = await stat(sourcePath);

		if (stats.isFile()) {
			if (!existsSync(sourcePath)) continue;
			await copyFile(sourcePath, targetPath);
		} else if (stats.isDirectory()) {
			if (!existsSync(targetPath))
				await mkdir(targetPath, { recursive: true });
			await mergeFolders(sourcePath, targetPath);
		}
	}
}

async function moveLocaleFiles(extractedPath: string, projectFolderName: string) {
	let path = extractedPath;
	while (true) {
		const stats = await stat(path);
		if (!stats.isDirectory()) throw new Error(`Path is not a directory: ${path}`);
		const files = await readdir(path);
		if (files.length === 0) throw new Error(`Could not find any files in ${path}`);
		if (files.includes("i18n")) {
			const i18nPath = resolve(path, "i18n");
			const i18nStats = await stat(i18nPath);
			if (i18nStats.isDirectory()) {
				const i18nFiles = await readdir(i18nPath);
				if (i18nFiles.includes("locales")) {
					path = resolve(i18nPath, "locales");
					break;
				}
			}
		}
		if (files.includes("locales")) {
			const localesPath = resolve(path, "locales");
			const localesStats = await stat(localesPath);
			if (localesStats.isDirectory()) {
				path = localesPath;
				break;
			}
		}
		// 只递归进入第一个是目录的文件夹
		let foundDir = false;
		for (const file of files) {
			const nextPath = resolve(path, file);
			const nextStats = await stat(nextPath);
			if (nextStats.isDirectory()) {
				path = nextPath;
				foundDir = true;
				break;
			}
		}
		if (!foundDir) throw new Error(`No directory found in ${path}`);
	}
	let projectPath = import.meta.dirname;
	while (true) {
		const files = await readdir(projectPath);
		if (projectPath === resolve(projectPath, "/")) throw new Error("Could not find project path");
		if (files.includes("i18n")) {
			const i18nPath = resolve(projectPath, "i18n");
			const i18nStats = await stat(i18nPath);
			if (i18nStats.isDirectory()) {
				const i18nFiles = await readdir(i18nPath);
				if (i18nFiles.includes("locales")) {
					projectPath = resolve(i18nPath, "locales");
					break;
				}
			}
		}
		if (files.includes("locales")) {
			const localesPath = resolve(projectPath, "locales");
			const localesStats = await stat(localesPath);
			if (localesStats.isDirectory()) {
				projectPath = localesPath;
				break;
			}
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
await moveLocaleFiles(extractedPath, "i18n/locales");
const remove = (path: string) => rm(path, { recursive: true, force: true });
await Promise.all([
	remove(filePath),
	remove(extractedPath),
]);
console.log(consoleColors.foreground.green + "Download successfully!" + consoleColors.reset);
