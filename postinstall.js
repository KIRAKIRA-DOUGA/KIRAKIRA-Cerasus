/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
import { exec as originalExec } from "child_process";

const commands = [
	"nuxi prepare",
	// "npm --prefix ./locales/editor run build",
];

/**
 * @param {string} command
 * @returns {Promise<string>}
 */
const exec = command => new Promise((resolve, reject) => originalExec(command, (error, stdout, stderr) => {
	if (error) reject(error);
	if (stderr) console.error(stderr);
	else console.log(stdout);
	resolve(stdout || stderr);
}));

for (const command of commands)
	await exec(command);
