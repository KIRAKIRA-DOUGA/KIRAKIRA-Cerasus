import http from "http";
import serverHandler from "../app.js";
import consoleColors from "../utils/console-colors.js";
import { exec } from "child_process";

const PORT = 5000;
const URL = `http://localhost:${PORT}/`;

const server = http.createServer(serverHandler);

const colors = consoleColors.foreground;
// eslint-disable-next-line no-console
console.log(`  ${colors.green}➜${colors.white} Start i18n editor server: ${colors.yellow}${URL}`);
exec(`start ${URL}`);

server.listen(PORT);
