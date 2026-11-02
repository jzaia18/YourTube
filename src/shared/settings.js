// Default settings, shared by the background script and the popup (both load ES modules).
// Content scripts can't `import`, so content.js keeps its own copy of the keys it reads.
export const DEFAULT_SETTINGS = {
  enabled: true, // master switch
  logoDestination: "homepage", // a key of LOGO_DESTINATIONS in logo-link.js
  logoCustomPath: "", // normalized path, used when logoDestination is "custom"
  hidePageAds: true, // hide ads outside the player (Page ads), on every page
  hideAskButton: true, // hide YouTube's AI "Ask" button on the watch page
  hideStoreShelf: false, // hide the Store shelf below the video on the watch page
  hideShortsInSubscriptions: false, // hide Shorts on the Subscriptions page
  hideGuideExplore: false, // hide the Guide's Explore section
  hideGuideMoreFromYouTube: false, // hide the Guide's More from YouTube section
};
