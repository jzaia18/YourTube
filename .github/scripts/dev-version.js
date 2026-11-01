// Computes the development version a pull request should carry, and writes it into manifest.json.
//
// Browsers only accept 1-4 dot-separated numbers in `version`, so a development build adds a
// fourth "dev" counter there, and shows its semver pre-release label in `version_name`:
//
//   dev build 3 of 0.2.0 ->  "version": "0.2.0.3", "version_name": "0.2.0-dev3"
//   release 0.2.0        ->  "version": "0.2.0",   "version_name": "0.2.0"
//
// Every pull request takes main's dev counter plus one; after a release, the next pull request
// starts dev1 of the following minor release. A pull request that sets both fields to the same
// new X.Y.Z is a release, and keeps the version it sets.
//
// Usage: node .github/scripts/dev-version.js <main manifest.json> <pull request manifest.json>

import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const DEV_NAME = /^(\d+)\.(\d+)\.(\d+)-dev(\d+)$/;
const RELEASE_NAME = /^(\d+)\.(\d+)\.(\d+)$/;

export function isRelease(main, pr) {
  return (
    RELEASE_NAME.test(pr.version_name ?? "") &&
    pr.version === pr.version_name &&
    pr.version_name !== main.version_name
  );
}

// The `{ version, version_name }` that follows main's.
export function nextDevVersion(main) {
  // A manifest without version_name predates this scheme: count it as dev0 of its version.
  const name = main.version_name ?? `${main.version}-dev0`;
  const dev = name.match(DEV_NAME);
  if (dev) {
    const [, major, minor, patch, n] = dev.map(Number);
    return devVersion(major, minor, patch, n + 1);
  }
  const release = name.match(RELEASE_NAME);
  if (release) {
    const [, major, minor] = release.map(Number);
    return devVersion(major, minor + 1, 0, 1);
  }
  throw new Error(`main's version_name "${name}" is neither X.Y.Z nor X.Y.Z-devN`);
}

function devVersion(major, minor, patch, n) {
  return {
    version: `${major}.${minor}.${patch}.${n}`,
    version_name: `${major}.${minor}.${patch}-dev${n}`,
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
