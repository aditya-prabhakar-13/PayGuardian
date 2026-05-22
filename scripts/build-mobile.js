/**
 * build-mobile.js
 *
 * Builds the Next.js client for Capacitor static export.
 *
 * API routes cannot exist during `output: 'export'`, so this script
 * temporarily renames `route.ts` files inside `src/app/api` to `route.ts.bak`,
 * runs the build, then restores them. This avoids Windows EPERM folder lock issues.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const API_DIR = path.join(__dirname, "..", "src", "app", "api");

function getRouteFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getRouteFiles(fullPath, fileList);
    } else if (file === "route.ts" || file === "route.js") {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function getBakFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getBakFiles(fullPath, fileList);
    } else if (file === "route.ts.bak" || file === "route.js.bak") {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function hide() {
  const routes = getRouteFiles(API_DIR);
  if (routes.length > 0) {
    console.log(`📦 Temporarily hiding ${routes.length} API route(s) for static export...`);
    routes.forEach(file => fs.renameSync(file, file + ".bak"));
  }
}

function restore() {
  const baks = getBakFiles(API_DIR);
  if (baks.length > 0) {
    baks.forEach(file => fs.renameSync(file, file.replace(/\.bak$/, "")));
    console.log(`✅ Restored ${baks.length} API route(s)`);
  }
}

try {
  // Clear the Next.js cache to prevent stale type errors (validator.ts looking for old routes)
  const nextCacheDir = path.join(__dirname, "..", ".next");
  if (fs.existsSync(nextCacheDir)) {
    console.log("🧹 Clearing .next cache...");
    fs.rmSync(nextCacheDir, { recursive: true, force: true });
  }

  hide();
  execSync("npx cross-env OUTPUT_MODE=export next build", {
    stdio: "inherit",
    env: { ...process.env },
  });
} finally {
  // Always restore, even on build failure
  restore();
}
