import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DEFAULT_SETTINGS } from "../src/shared/settings.js";
import { LOGO_DESTINATIONS } from "../src/shared/logo-link.js";

// Content scripts can't import, so they keep hand-made copies of values from src/shared/.
// Reads `const <name> = { ... };` out of a content script's source.
function readCopy(file, name) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const match = source.match(new RegExp(`const ${name} = (\\{[^;]*\\});`));
  assert.ok(match, `${file} should define \`const ${name} = { ... };\``);
  return Function(`return (${match[1]});`)();
}

test("content.js has the same default settings as src/shared/settings.js", () => {
  assert.deepEqual(readCopy("src/content/content.js", "DEFAULT_SETTINGS"), DEFAULT_SETTINGS);
});

test("content/logo-link.js has the same logo destinations as the popup", () => {
  const copy = readCopy("src/content/logo-link.js", "DESTINATIONS");
  const labels = Object.fromEntries(Object.entries(copy).map(([key, { label }]) => [key, label]));
  // Homepage is YouTube's own behaviour and Custom comes from the user, so neither has a fixed path.
  const { homepage, custom, ...withPaths } = LOGO_DESTINATIONS;
  assert.deepEqual(labels, withPaths);
});
