// Logo link: the logo destinations offered in the popup, and validation of Custom paths.
// content/logo-link.js keeps its own copy of the destination paths and labels (content scripts can't import);
// tests/content-copies.test.js checks the two still match.

export const LOGO_DESTINATIONS = {
  homepage: "Homepage",
  subscriptions: "Subscriptions",
  watchLater: "Watch later",
  custom: "Custom",
};

const ORIGIN = "https://www.youtube.com";
// Pasted URLs from any supported YouTube site are reduced to their path, which the logo
// then opens on whichever site the user is browsing.
const ALLOWED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "m.youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);
const SCHEME = /^[a-z][a-z\d+.-]*:/i;
const VIDEO_ID = /^[\w-]+$/;
const INVALID = { ok: false, error: "Enter a page on youtube.com, like /feed/history." };

// Turns whatever the user typed into a YouTube path ("" when blank), or rejects it.
export function normalizeCustomPath(input) {
  let value = input.trim();
  if (value === "") return { ok: true, path: "" };
  // A first segment with a dot is a host typed without https:// ("youtube.com/feed", "youtu.be/abc"),
  // except for a channel handle, which may contain dots ("@some.channel").
  const firstSegment = value.split(/[/?#]/, 1)[0];
  if (firstSegment.includes(".") && !firstSegment.startsWith("@")) value = `https://${value}`;

  const isAbsolute = SCHEME.test(value) || value.startsWith("//");
  let url;
  try {
    url = new URL(isAbsolute || value.startsWith("/") ? value : `/${value}`, ORIGIN);
  } catch {
    return INVALID;
  }

  if (!isAbsolute) return url.origin === ORIGIN ? pathOf(url) : INVALID;
  if ((url.protocol !== "https:" && url.protocol !== "http:") || url.port) return INVALID;
  if (url.hostname === "youtu.be") return shortLinkPath(url);
  return ALLOWED_HOSTS.has(url.hostname) ? pathOf(url) : INVALID;
}

function pathOf(url) {
  return { ok: true, path: url.pathname + url.search + url.hash };
}

// youtu.be/<id> is YouTube's short link for /watch?v=<id>.
function shortLinkPath(url) {
  const id = url.pathname.slice(1);
  if (!VIDEO_ID.test(id)) return INVALID;
  const search = new URLSearchParams([["v", id], ...url.searchParams]);
  return { ok: true, path: `/watch?${search}${url.hash}` };
}
