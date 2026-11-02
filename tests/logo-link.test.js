import { test } from "node:test";
import assert from "node:assert/strict";
import "../src/shared/logo-link.js";

const { normalizeCustomPath } = globalThis.yourtubeLogoLink;

const ok = (path) => ({ ok: true, path });

test("adds a missing leading slash", () => {
  assert.deepEqual(normalizeCustomPath("feed/history"), ok("/feed/history"));
  assert.deepEqual(normalizeCustomPath("/feed/history"), ok("/feed/history"));
});

test("keeps query strings and fragments", () => {
  assert.deepEqual(normalizeCustomPath("playlist?list=PL123"), ok("/playlist?list=PL123"));
  assert.deepEqual(normalizeCustomPath("/watch?v=abc#t=10"), ok("/watch?v=abc#t=10"));
});

test("reduces pasted YouTube URLs to their path", () => {
  assert.deepEqual(normalizeCustomPath("https://www.youtube.com/@channel/videos"), ok("/@channel/videos"));
  assert.deepEqual(normalizeCustomPath("http://youtube.com/feed/history"), ok("/feed/history"));
  assert.deepEqual(normalizeCustomPath("www.youtube.com/feed/history"), ok("/feed/history"));
  assert.deepEqual(normalizeCustomPath("youtube.com/playlist?list=WL"), ok("/playlist?list=WL"));
});

test("accepts URLs from every supported YouTube site", () => {
  assert.deepEqual(normalizeCustomPath("https://m.youtube.com/feed/subscriptions"), ok("/feed/subscriptions"));
  assert.deepEqual(normalizeCustomPath("m.youtube.com/feed/history"), ok("/feed/history"));
  assert.deepEqual(normalizeCustomPath("https://www.youtube-nocookie.com/embed/abc"), ok("/embed/abc"));
  assert.deepEqual(normalizeCustomPath("youtube-nocookie.com/embed/abc"), ok("/embed/abc"));
});

test("expands youtu.be short links to watch pages", () => {
  assert.deepEqual(normalizeCustomPath("https://youtu.be/dQw4w9WgXcQ"), ok("/watch?v=dQw4w9WgXcQ"));
  assert.deepEqual(normalizeCustomPath("youtu.be/abc?t=10"), ok("/watch?v=abc&t=10"));
});

test("keeps channel handles that contain dots", () => {
  assert.deepEqual(normalizeCustomPath("@some.channel/videos"), ok("/@some.channel/videos"));
  assert.deepEqual(normalizeCustomPath("/@some.channel"), ok("/@some.channel"));
});

test("trims surrounding whitespace", () => {
  assert.deepEqual(normalizeCustomPath("  feed/history \n"), ok("/feed/history"));
});

test("treats an empty value as no custom path", () => {
  assert.deepEqual(normalizeCustomPath(""), ok(""));
  assert.deepEqual(normalizeCustomPath("   "), ok(""));
});

test("rejects anything that leaves YouTube", () => {
  for (const input of [
    "https://evil.com/feed",
    "//evil.com",
    "/\\evil.com",
    "evil.com/feed",
    "https://music.youtube.com/",
    "music.youtube.com/feed",
    "youtu.be",
    "https://youtu.be/abc/def",
    "https://www.youtube.com.evil.com/",
    "https://evil-youtube-nocookie.com/",
    "javascript:alert(1)",
    "data:text/html,hi",
  ]) {
    const result = normalizeCustomPath(input);
    assert.equal(result.ok, false, `expected ${JSON.stringify(input)} to be rejected`);
    assert.equal(typeof result.error, "string");
  }
});
