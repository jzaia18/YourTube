import "../shared/settings.js";

const { DEFAULT_SETTINGS } = globalThis.yourtubeSettings;

// Fires on first install, on every extension update, and on Chrome updates.
// Fill in any settings keys that don't exist yet without clobbering the user's choices.
browser.runtime.onInstalled.addListener(async ({ reason }) => {
  const existing = await browser.storage.sync.get(DEFAULT_SETTINGS);
  await browser.storage.sync.set(existing);
  console.log(`[YouRTube] onInstalled (${reason})`, existing);
});
