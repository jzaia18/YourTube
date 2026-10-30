// Runs in every top-level page on the YouTube sites listed in manifest.json, in an isolated
// JS world: it shares the page's DOM but not its JS globals. The feature scripts listed before this one
// in manifest.json each define a top-level object with apply(settings); this script loads the
// settings and hands them to every feature, now and whenever they change.
(() => {
  const DEFAULT_SETTINGS = { enabled: true, logoDestination: "homepage", logoCustomPath: "", hideAskButton: true }; // keep in sync with src/shared/settings.js (checked by tests/content-copies.test.js)
  const FEATURES = [logoLink, hideAskButton];

  let settings = { ...DEFAULT_SETTINGS };
  const applyAll = () => FEATURES.forEach((feature) => feature.apply(settings));

  browser.storage.sync.get(DEFAULT_SETTINGS).then((stored) => {
    settings = stored;
    applyAll();
  });

  // React to the popup changing settings, live, in every open tab.
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (key in DEFAULT_SETTINGS) settings[key] = newValue ?? DEFAULT_SETTINGS[key];
    }
    applyAll();
  });
})();
