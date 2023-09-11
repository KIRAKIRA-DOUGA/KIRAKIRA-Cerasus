import http from "http";
import serverHandler from "../app.js";
import consoleColors from "../console-colors.js";

const PORT = 5000;

const server = http.createServer(serverHandler);

const colors = consoleColors.foreground;
// eslint-disable-next-line no-console
console.log(`    ${colors.green}→${colors.white} Start i18n editor server: ${colors.yellow}http://localhost:${PORT}/`);

server.listen(PORT);
