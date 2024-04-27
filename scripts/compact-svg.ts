import { readFile, writeFile } from "fs/promises";

let svgPath = process.argv[2];
if (svgPath === "--") svgPath = process.argv[3];
if (!svgPath) throw new ReferenceError("未指定 SVG 文件。");
let svg = await readFile(svgPath, "utf-8");

// 只是写简单的处理，复杂的暂且不能完胜。

svg = svg.replaceAll(/\sfill="[^"]*"/g, "").replaceAll(/\s*<\/?g.*>/g, "").replaceAll(/\s*<defs>.*<\/defs>/gs, "").replaceAll(/\t+/g, "\t");
writeFile(svgPath, svg);
