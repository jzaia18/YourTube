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
// sets (a quoted "data-yourtube-…" string in the code of src/content/*.js, e.g. the logo link's).
// Comments are stripped first, so an attribute that's only mentioned doesn't count as set.
const settingAttributes = Object.entries(SETTINGS)
  .filter(([, setting]) => setting.css === "attribute")
  .map(([key]) => cssAttribute(key));
const withoutComments = (js) => js.replace(/\/\*[\s\S]*?\*\/|(?<=^|\s)\/\/.*/gm, "");
const scriptAttributes = contentFiles(".js").flatMap((file) =>
  [...withoutComments(read(file)).matchAll(/["'](data-yourtube-[a-z0-9-]+)["']/g)].map((match) => match[1]),
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

// What comes before the block of every top-level rule in a stylesheet (a selector list, or an
// at-rule such as "@media …"), comments stripped and whitespace collapsed.
function preludesOf(file) {
  const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
  const preludes = [];
  let depth = 0;
  let prelude = "";
  for (const char of css) {
    if (char === "{") {
      if (depth === 0) preludes.push(prelude.trim().replace(/\s+/g, " "));
      depth++;
      prelude = "";
    } else if (char === "}") {
      depth--;
      prelude = "";
    } else if (depth === 0) {
      prelude += char;
    }
  }
  return preludes;
}

const preludes = cssFiles.flatMap((file) => preludesOf(file).map((prelude) => ({ file, prelude })));
const isAtRule = ({ prelude }) => prelude.startsWith("@");

const SCOPE = /^html\[(data-yourtube-[a-z0-9-]+)\]/;
const scopes = preludes
  .filter((rule) => !isAtRule(rule))
  .flatMap(({ file, prelude }) =>
    splitTopLevel(prelude).map((part) => {
      const selector = part.trim();
      return { file, selector, attribute: selector.match(SCOPE)?.[1] };
    }),
  );

// The checks below read only top-level rules' selectors, so an unscoped rule inside an at-rule
// would slip past them.
test("content CSS has no at-rules, which these checks don't look inside", () => {
  for (const { file, prelude } of preludes.filter(isAtRule)) {
    assert.fail(`${file}: "${prelude}" isn't checked; extend tests/content-css.test.js to look inside at-rules`);
  }
});

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
