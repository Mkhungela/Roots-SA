/**
 * Preflight for `npm run dev` / `npm run build`.
 *
 * Some sandboxes and CI caches drop `node_modules` between runs, which makes
 * `next dev` die with `sh: next: not found` before it can print anything useful.
 * This checks for the one binary we actually need and restores from the lockfile
 * if it is missing, so the dev script is always safe to run from a cold tree.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const marker = join(root, "node_modules", "next", "package.json");

if (existsSync(marker)) process.exit(0);

console.log("node_modules is missing or incomplete — restoring from the lockfile…");
const res = spawnSync("npm", ["install", "--no-audit", "--no-fund"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(res.status ?? 1);
