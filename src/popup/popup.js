import { DEFAULT_SETTINGS } from "../shared/settings.js";

// The popup is a fresh page each time it opens and is destroyed when it closes,
// so all state lives in browser.storage, never in variables here.
const checkbox = document.getElementById("enabled");

const { enabled } = await browser.storage.sync.get(DEFAULT_SETTINGS);
checkbox.checked = enabled;

checkbox.addEventListener("change", () => {
  browser.storage.sync.set({ enabled: checkbox.checked });
});
