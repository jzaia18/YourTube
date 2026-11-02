import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import "../src/shared/settings.js";

const { SETTINGS, cssAttribute } = globalThis.yourtubeSettings;

// Principle 1: every feature's CSS reverts live when the feature is off, because every rule is
// scoped under an attribute on <html> that's set only while the feature is active.

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const contentFiles = (extension) =>
  readdirSync(new URL("src/content/", root))
    .filter((name) => name.endsWith(extension))
    .map((name) => `src/content/${name}`);
const cssFiles = contentFiles(".css");

// The attributes features set on <html>: one per CSS-only setting, plus any a feature's own JS
// sets (a quoted "data-yourtube-…" string in src/content/*.js, e.g. the logo link's).
const settingAttributes = Object.entries(SETTINGS)
  .filter(([, setting]) => setting.css === "attribute")
  .map(([key]) => cssAttribute(key));
const scriptAttributes = contentFiles(".js").flatMap((file) =>
  [...read(file).matchAll(/["'](data-yourtube-[a-z-]+)["']/g)].map((match) => match[1]),
);
const featureAttributes = new Set([...settingAttributes, ...scriptAttributes]);

// Splits on commas outside parentheses and brackets, e.g. inside :has(a, b).
function splitTopLevel(list) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const char of list) {
    if (char === "(" || char === "[") depth++;
    if (char === ")" || char === "]") depth--;
    if (char === "," && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  return [...parts, current];
}

// Every selector of every rule in a stylesheet, comments stripped and whitespace collapsed.
function selectorsOf(file) {
  const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [];
  let depth = 0;
  let prelude = "";
  for (const char of css) {
    if (char === "{") {
      if (depth === 0) {
        assert.ok(!prelude.trim().startsWith("@"), `${file}: at-rules aren't checked yet; extend tests/content-css.test.js`);
        selectors.push(...splitTopLevel(prelude).map((selector) => selector.trim().replace(/\s+/g, " ")));
      }
      depth++;
      prelude = "";
    } else if (char === "}") {
      depth--;
      prelude = "";
    } else if (depth === 0) {
      prelude += char;
    }
  }
  return selectors;
}

const SCOPE = /^html\[(data-yourtube-[a-z-]+)\]/;
const scopes = cssFiles.flatMap((file) => selectorsOf(file).map((selector) => ({ file, selector, attribute: selector.match(SCOPE)?.[1] })));

test("every content CSS selector is scoped under an attribute a feature sets", () => {
  assert.ok(scopes.length > 0, "src/content/ should have CSS rules");
  for (const { file, selector, attribute } of scopes) {
    assert.ok(attribute, `${file}: "${selector}" should start with html[data-yourtube-…]`);
    assert.ok(featureAttributes.has(attribute), `${file}: "${selector}" is scoped under ${attribute}, which no setting or feature script sets`);
  }
});

test("every feature's attribute is used by some content CSS", () => {
  const used = new Set(scopes.map(({ attribute }) => attribute));
  for (const attribute of featureAttributes) {
    assert.ok(used.has(attribute), `no CSS in src/content/ is scoped under ${attribute}`);
  }
});

test("manifest.json lists exactly the CSS files in src/content/", () => {
  const listed = JSON.parse(read("manifest.json")).content_scripts.flatMap((script) => script.css ?? []);
  assert.deepEqual([...listed].sort(), [...cssFiles].sort());
});
