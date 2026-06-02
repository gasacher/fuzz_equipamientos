import { execSync } from "node:child_process";
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const stashDir = path.join(root, ".gh-pages-stash");
const disabled = [];

async function disable(...relPaths) {
  await mkdir(stashDir, { recursive: true });
  for (const rel of relPaths) {
    const from = path.join(root, rel);
    const to = path.join(stashDir, rel.replace(/\//g, "__"));
    await rename(from, to);
    disabled.push([to, from]);
  }
}

async function restore() {
  for (const [from, to] of disabled.reverse()) {
    await rename(from, to);
  }
}

await disable("src/app/admin", "src/app/login", "src/app/api");

try {
  execSync("npx next build", {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: "/fuzz_equipamientos",
    },
  });
} finally {
  await restore();
}
