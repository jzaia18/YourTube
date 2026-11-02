import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import "../src/shared/settings.js";

const { DEFAULT_SETTINGS } = globalThis.yourtubeSettings;
const html = readFileSync(new URL("../src/popup/popup.html", import.meta.url), "utf8");

// popup.js saves each checkbox's state under the setting its data-setting attribute names,
// so a typo there would silently store a new key instead of the setting.
test("every popup checkbox names a boolean setting", () => {
  const names = [...html.matchAll(/data-setting="([^"]*)"/g)].map((match) => match[1]);
  assert.ok(names.length > 0, "popup.html should have checkboxes with data-setting");
  for (const name of names) {
    assert.equal(typeof DEFAULT_SETTINGS[name], "boolean", `data-setting="${name}" should name a boolean in DEFAULT_SETTINGS`);
  }
});

// Each setting explains itself in a tooltip (the title of the label wrapping its checkbox).
test("every popup checkbox has a tooltip", () => {
  const labels = [...html.matchAll(/<label\b([^>]*)>\s*<input\b[^>]*data-setting="([^"]*)"/g)];
  assert.equal(labels.length, [...html.matchAll(/data-setting=/g)].length, "every checkbox should sit first inside its <label>");
  for (const [, attributes, name] of labels) {
    assert.match(attributes, /\btitle="[^"]+"/, `the label of data-setting="${name}" should have a title`);
  }
});
