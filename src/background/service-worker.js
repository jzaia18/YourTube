import { DEFAULT_SETTINGS } from "../shared/settings.js";

// Fires on first install, on every extension update, and on Chrome updates.
// Fill in any settings keys that don't exist yet without clobbering the user's choices.
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  const existing = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  await chrome.storage.sync.set(existing);
  console.log(`[OurTube] onInstalled (${reason})`, existing);
});
