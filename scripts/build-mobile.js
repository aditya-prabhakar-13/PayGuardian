/**
 * build-mobile.js
 *
 * Builds the Next.js client for Capacitor static export.
 *
 * API routes cannot exist during `output: 'export'`, so this script
 * temporarily hides the `src/app/api` directory by renaming it to
 * `src/app/_api` (underscore-prefixed dirs are ignored by Next.js),
 * runs the build, then restores it.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const API_DIR = path.join(__dirname, "..", "src", "app", "api");
const HIDDEN_DIR = path.join(__dirname, "..", "src", "app", "_api");

function hide() {
  if (fs.existsSync(API_DIR)) {
    fs.renameSync(API_DIR, HIDDEN_DIR);
    console.log("📦 Temporarily hiding src/app/api for static export...");
  }
}

function restore() {
  if (fs.existsSync(HIDDEN_DIR)) {
    fs.renameSync(HIDDEN_DIR, API_DIR);
    console.log("✅ Restored src/app/api");
  }
}

try {
  hide();
  execSync("npx cross-env OUTPUT_MODE=export next build", {
    stdio: "inherit",
    env: { ...process.env },
  });
} finally {
  // Always restore, even on build failure
  restore();
}
