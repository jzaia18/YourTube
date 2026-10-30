import { DEFAULT_SETTINGS } from "../shared/settings.js";
import { LOGO_DESTINATIONS, normalizeCustomPath } from "../shared/logo-link.js";

// The popup is a fresh page each time it opens and is destroyed when it closes,
// so all state lives in browser.storage, never in variables here.
const enabled = document.getElementById("enabled");
const offNote = document.getElementById("off-note");
const destination = document.getElementById("logo-destination");
const custom = document.getElementById("logo-custom");
const customPath = document.getElementById("logo-custom-path");
const customError = document.getElementById("logo-custom-error");
const customHint = document.getElementById("logo-custom-hint");

for (const [value, label] of Object.entries(LOGO_DESTINATIONS)) {
  destination.add(new Option(label, value));
}

const settings = await browser.storage.sync.get(DEFAULT_SETTINGS);
// Each checkbox with a data-setting attribute stores the boolean setting it names.
const checkboxes = document.querySelectorAll("input[type=checkbox][data-setting]");
for (const checkbox of checkboxes) checkbox.checked = settings[checkbox.dataset.setting];
destination.value = settings.logoDestination;
customPath.value = settings.logoCustomPath;
let savedPath = settings.logoCustomPath; // the custom path the logo uses right now
render();

function render() {
  offNote.hidden = enabled.checked;
  custom.hidden = destination.value !== "custom";

  const result = normalizeCustomPath(customPath.value);
  customPath.setAttribute("aria-invalid", String(!result.ok));
  customError.hidden = result.ok;
  customError.textContent = result.ok ? "" : result.error;
  // Say where the logo goes when the field doesn't hold a page it can use.
  let hint = "";
  if (!result.ok) hint = `Not saved: the logo still goes to ${savedPath || "the homepage"}.`;
  else if (result.path === "") hint = "Until you enter a page, the logo goes to the homepage.";
  customHint.hidden = !hint;
  customHint.textContent = hint;
}

for (const checkbox of checkboxes) {
  checkbox.addEventListener("change", () => {
    render();
    browser.storage.sync.set({ [checkbox.dataset.setting]: checkbox.checked });
  });
}

destination.addEventListener("change", () => {
  render();
  browser.storage.sync.set({ logoDestination: destination.value });
});

// Saves the typed path if it's valid and differs from the saved one.
let saveTimer;
function saveCustomPath() {
  clearTimeout(saveTimer);
  const result = normalizeCustomPath(customPath.value);
  if (!result.ok || result.path === savedPath) return;
  savedPath = result.path;
  browser.storage.sync.set({ logoCustomPath: savedPath });
}

// Save as the user types, debounced because storage.sync limits writes per minute.
customPath.addEventListener("input", () => {
  render();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCustomPath, 300);
});

// Committing the field (Enter, or leaving it) saves at once and shows the cleaned-up form.
customPath.addEventListener("change", () => {
  saveCustomPath();
  const result = normalizeCustomPath(customPath.value);
  if (result.ok) customPath.value = result.path;
});

// Closing the popup destroys it, pending save included, so save first.
window.addEventListener("pagehide", saveCustomPath);
