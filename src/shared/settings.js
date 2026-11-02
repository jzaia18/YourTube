// Every setting, described once. The background script and the popup import this (both load ES
// modules); content scripts can't `import`, so content.js keeps a copy of SETTINGS (checked by
// tests/content-copies.test.js).
//
// Each entry:
// - default: the value a new install starts with.
// - off: the value that leaves YouTube unchanged. While the Master switch (enabled) is off,
//   content scripts see every setting at its off value. The Master switch itself has none.
// - css: "attribute" for a CSS-only feature. content.js sets data-yourtube-<key in kebab-case>
//   (e.g. hidePageAds -> data-yourtube-hide-page-ads) on <html> while the setting is true, and
//   the feature's CSS is scoped under that attribute. A setting without css is read only by a
//   feature's JS.
export const SETTINGS = {
  enabled: { default: true }, // Master switch
  logoDestination: { default: "homepage", off: "homepage" }, // a key of LOGO_DESTINATIONS in logo-link.js
  logoCustomPath: { default: "", off: "" }, // normalized path, used when logoDestination is "custom"
  hidePageAds: { default: true, off: false, css: "attribute" }, // hide ads outside the player (Page ads), on every page
  hideAskButton: { default: true, off: false, css: "attribute" }, // hide YouTube's AI "Ask" button on the watch page
  hideJoinButton: { default: false, off: false, css: "attribute" }, // hide the Join button below the video on the watch page
  hideStoreShelf: { default: false, off: false, css: "attribute" }, // hide the Store shelf below the video on the watch page
  hideShortsOnHomepage: { default: false, off: false, css: "attribute" }, // hide Shorts on the homepage
  hideShortsInSubscriptions: { default: false, off: false, css: "attribute" }, // hide Shorts on the Subscriptions page
  hideShortsInSearch: { default: false, off: false, css: "attribute" }, // hide Shorts on the search results page
  hideGuideExplore: { default: false, off: false, css: "attribute" }, // hide the Guide's Explore section
  hideGuideMoreFromYouTube: { default: false, off: false, css: "attribute" }, // hide the Guide's More from YouTube section
};

// Each setting's default, by key: what browser.storage.sync.get() takes to fill in missing keys.
export const DEFAULT_SETTINGS = Object.fromEntries(Object.entries(SETTINGS).map(([key, setting]) => [key, setting.default]));
