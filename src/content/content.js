// Runs inside every https://www.youtube.com/* tab, in an isolated JS world:
// it shares the page's DOM but not its JS globals.
(() => {
  const BANNER_ID = "ourtube-hello";
  const DEFAULT_SETTINGS = { enabled: true }; // keep in sync with src/shared/settings.js

  function render(enabled) {
    document.documentElement.toggleAttribute("data-ourtube", enabled);

    let banner = document.getElementById(BANNER_ID);
    if (!enabled) {
      banner?.remove();
      return;
    }
    if (!banner) {
      banner = document.createElement("div");
      banner.id = BANNER_ID;
      document.body.append(banner);
    }
    banner.textContent = `Hello from OurTube! (${location.pathname})`;
  }

  let enabled = DEFAULT_SETTINGS.enabled;

  chrome.storage.sync.get(DEFAULT_SETTINGS).then((settings) => {
    enabled = settings.enabled;
    render(enabled);
  });

  // React to the popup toggling the setting, live, in every open tab.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && "enabled" in changes) {
      enabled = changes.enabled.newValue;
      render(enabled);
    }
  });

  // YouTube is a single-page app: clicking a video doesn't load a new page, so this
  // script runs only once per tab. YouTube fires this event after each in-app navigation.
  document.addEventListener("yt-navigate-finish", () => render(enabled));

  console.log("[OurTube] content script loaded");
})();
