import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/shared/settings.js";

const { SETTINGS, DEFAULT_SETTINGS, cssAttribute } = globalThis.yourtubeSettings;

// While the Master switch is off, content scripts see every setting at its off value.
test("every setting except the Master switch has an off value", () => {
  for (const [key, setting] of Object.entries(SETTINGS)) {
    if (key === "enabled") continue;
    assert.ok("off" in setting, `${key} should have an off value`);
  }
});

// content.js sets a CSS-only feature's attribute while its setting is true, so off has to be false.
test("every CSS-only setting is a boolean that's false when off", () => {
  for (const [key, setting] of Object.entries(SETTINGS)) {
    if (!("css" in setting)) continue;
    assert.equal(setting.css, "attribute", `${key}: "attribute" is the only css kind so far`);
    assert.equal(typeof setting.default, "boolean", `${key} should default to a boolean`);
    assert.equal(setting.off, false, `${key} should be off when false`);
  }
});

test("DEFAULT_SETTINGS holds each setting's default", () => {
  assert.deepEqual(Object.keys(DEFAULT_SETTINGS), Object.keys(SETTINGS));
  for (const [key, setting] of Object.entries(SETTINGS)) assert.equal(DEFAULT_SETTINGS[key], setting.default);
});

test("cssAttribute turns a setting key into kebab case", () => {
  assert.equal(cssAttribute("hidePageAds"), "data-yourtube-hide-page-ads");
  assert.equal(cssAttribute("hideGuideMoreFromYouTube"), "data-yourtube-hide-guide-more-from-you-tube");
});
