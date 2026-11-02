// Runs in every top-level page on the YouTube sites listed in manifest.json, in an isolated
// JS world: it shares the page's DOM but not its JS globals. It loads the settings and applies
// them, now and whenever they change: it sets the attribute each CSS-only feature's CSS is
// scoped under, and hands the settings to every feature with JS of its own (FEATURES, each
// defined by a script listed before this one in manifest.json, with an idempotent apply(settings)).
(() => {
  const { SETTINGS, DEFAULT_SETTINGS } = yourtubeSettings; // src/shared/settings.js, listed before this script
  const FEATURES = [logoLink];

  const entries = Object.entries(SETTINGS);
  // What features see while the Master switch is off: every setting at its off value, plain YouTube.
  const OFF = { ...Object.fromEntries(entries.map(([key, setting]) => [key, setting.off])), enabled: false };
  // Each CSS-only feature's setting and its attribute: hidePageAds -> data-yourtube-hide-page-ads.
  const ATTRIBUTES = entries
    .filter(([, setting]) => setting.css === "attribute")
    .map(([key]) => [key, "data-yourtube-" + key.replace(/[A-Z]/g, (letter) => "-" + letter.toLowerCase())]);

  let stored = { ...DEFAULT_SETTINGS };
  function applyAll() {
    const settings = stored.enabled ? stored : OFF;
    for (const [key, attribute] of ATTRIBUTES) {
      document.documentElement.toggleAttribute(attribute, settings[key] === true);
    }
    for (const feature of FEATURES) feature.apply(settings);
  }

  browser.storage.sync.get(DEFAULT_SETTINGS).then((values) => {
    stored = values;
    applyAll();
  });

  // React to the popup changing settings, live, in every open tab.
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key in SETTINGS) stored[key] = newValue ?? SETTINGS[key].default;
    }
    applyAll();
  });

  // Mark the current page's path on <html> (data-yourtube-path), so feature CSS can target one
  // page. currententrychange fires on every in-app navigation, back/forward included. Set up
  // last and guarded, so a missing Navigation API only loses the marker, not every feature.
  const markPath = () => (document.documentElement.dataset.yourtubePath = location.pathname);
  markPath();
  window.navigation?.addEventListener("currententrychange", markPath);
})();
