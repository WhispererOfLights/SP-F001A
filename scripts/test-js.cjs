const { readdirSync } = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const tests = readdirSync(path.join(root, "tests"))
  .filter(name => name.endsWith(".cjs"))
  .sort();

for (const test of tests) {
  console.log(`\n==> ${test}`);
  const result = spawnSync(process.execPath, [path.join(root, "tests", test)], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
