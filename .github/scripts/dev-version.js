// Computes the development version a pull request should carry, and writes it into manifest.json.
//
// Browsers only accept 1-4 dot-separated numbers in `version`, so a development build keeps the
// last release's number plus a fourth "dev" counter there, and shows its semver pre-release label
// in `version_name`:
//
//   release 0.1.0       ->  "version": "0.1.0"
//   dev build 3 of 0.2.0 ->  "version": "0.1.0.3", "version_name": "0.2.0-dev3"
//
// Every pull request takes main's dev counter plus one. A pull request that removes `version_name`
// and raises `version` above main's is a release, and keeps the version it sets.
//
// Usage: node .github/scripts/dev-version.js <main manifest.json> <pull request manifest.json>

import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const DEV_NAME = /^(\d+)\.(\d+)\.(\d+)-dev(\d+)$/;

function parseNumbers(version) {
  if (!/^\d+(\.\d+){0,3}$/.test(version)) {
    throw new Error(`"${version}" is not 1-4 dot-separated numbers`);
  }
  return version.split(".").map(Number);
}

// Negative, zero, or positive, like a sort comparator. Missing parts count as 0.
export function compareVersions(a, b) {
  const [x, y] = [parseNumbers(a), parseNumbers(b)];
  for (let i = 0; i < 4; i++) {
    const diff = (x[i] ?? 0) - (y[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function isRelease(main, pr) {
  return pr.version_name === undefined && compareVersions(pr.version, main.version) > 0;
}

// The `{ version, version_name }` that follows main's.
export function nextDevVersion(main) {
  if (main.version_name === undefined) {
    // main is a release: start the dev cycle toward the next minor release.
    const [major, minor, patch] = parseNumbers(main.version);
    return {
      version: `${major}.${minor}.${patch ?? 0}.1`,
      version_name: `${major}.${minor + 1}.0-dev1`,
    };
  }
  const match = main.version_name.match(DEV_NAME);
  if (!match) throw new Error(`main's version_name "${main.version_name}" is not X.Y.Z-devN`);
  const [, major, minor, patch, dev] = match.map(Number);
  const [a, b, c] = parseNumbers(main.version);
  return {
    version: `${a}.${b ?? 0}.${c ?? 0}.${dev + 1}`,
    version_name: `${major}.${minor}.${patch}-dev${dev + 1}`,
  };
}

// Rewrites the version fields in manifest.json's text, leaving the rest of its formatting alone.
export function writeVersion(text, { version, version_name }) {
  const versionLine = /^(\s*)"version": "[^"]*",\n/m;
  if (!versionLine.test(text)) throw new Error('manifest.json has no "version" line');
  const withoutName = text.replace(/^\s*"version_name": "[^"]*",\n/m, "");
  return withoutName.replace(
    versionLine,
    (_, indent) => `${indent}"version": "${version}",\n${indent}"version_name": "${version_name}",\n`,
  );
}

function main([mainPath, prPath]) {
  const mainManifest = JSON.parse(readFileSync(mainPath, "utf8"));
  const prText = readFileSync(prPath, "utf8");
  const prManifest = JSON.parse(prText);
  const outputs = { release: false, changed: false };

  console.log(`[YourTube] main: ${mainManifest.version_name ?? mainManifest.version}`);
  console.log(`[YourTube] pull request: ${prManifest.version_name ?? prManifest.version}`);

  if (isRelease(mainManifest, prManifest)) {
    console.log(`[YourTube] Release ${prManifest.version}: keeping its version.`);
    outputs.release = true;
  } else {
    const next = nextDevVersion(mainManifest);
    outputs.version_name = next.version_name;
    if (prManifest.version === next.version && prManifest.version_name === next.version_name) {
      console.log(`[YourTube] Already on ${next.version_name}.`);
    } else {
      writeFileSync(prPath, writeVersion(prText, next));
      console.log(`[YourTube] Updated to ${next.version_name} (version ${next.version}).`);
      outputs.changed = true;
    }
  }

  if (process.env.GITHUB_OUTPUT) {
    const lines = Object.entries(outputs).map(([key, value]) => `${key}=${value}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT, lines.join(""));
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
