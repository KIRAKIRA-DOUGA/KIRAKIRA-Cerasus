import plaintextLoaderPluginGenerator from "./utils/plaintext";

// vueDocsPlugin
const docsLoader = plaintextLoaderPluginGenerator("docs-loader", /vue&type=docs/);

export default docsLoader;
