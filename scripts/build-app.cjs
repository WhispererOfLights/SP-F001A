const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "src", "App.jsx");
const browserPath = path.join(root, "src", "App.browser.jsx");
const runtimeSourcePath = path.join(root, "src", "App.runtime.jsx");
const runtimePath = path.join(root, "src", "App.runtime.js");
const babelPath = path.join(root, "vendor", "babel.min.js");

const source = fs.readFileSync(sourcePath, "utf8");
const expandedSource = source.replace(/^\/\/ @include (.+)$/gm, (_, relativePath) => {
  const includePath = path.join(root, "src", relativePath.trim());
  if (!fs.existsSync(includePath)) throw new Error(`Module inclus introuvable : ${relativePath}`);
  return fs.readFileSync(includePath, "utf8");
});
let browserSource = expandedSource.replace(
  'import { useState, useEffect, useCallback } from "react";',
  "const { useState, useEffect, useCallback } = React;"
);
if (browserSource === expandedSource) {
  throw new Error("Import React attendu introuvable dans src/App.jsx");
}
browserSource = browserSource.replace("export default function App(){", "function App(){");
if (!browserSource.includes("function App(){")) {
  throw new Error("Export App attendu introuvable dans src/App.jsx");
}
browserSource += '\n\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));\n';

const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(babelPath, "utf8"), context, { filename: babelPath });
const transformed = context.Babel.transform(browserSource, {
  presets: ["env", ["react", { runtime: "classic" }]],
  sourceType: "script",
  comments: true,
  compact: false,
}).code;

fs.writeFileSync(browserPath, browserSource, "utf8");
fs.writeFileSync(runtimeSourcePath, browserSource, "utf8");
fs.writeFileSync(runtimePath, transformed + "\n", "utf8");
console.log("Application reconstruite : src/App.runtime.js");
