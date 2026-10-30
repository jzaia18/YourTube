import { DEFAULT_SETTINGS } from "../shared/settings.js";

// The popup is a fresh page each time it opens and is destroyed when it closes,
// so all state lives in chrome.storage, never in variables here.
const checkbox = document.getElementById("enabled");

const { enabled } = await chrome.storage.sync.get(DEFAULT_SETTINGS);
checkbox.checked = enabled;

checkbox.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: checkbox.checked });
});
