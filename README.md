# OurTube
Make YouTube for "Us" Again

A browser extension for Chrome and Firefox that rewrites the YouTube UI.

## Principles

- **You're in control.** Every change OurTube makes can be switched off in its settings, and toggles apply instantly.
- **Still YouTube.** Changes are subtle and match YouTube's own look.
- **Signed in or not.** Everything works whether or not you're logged in.
- **Looks only.** OurTube changes what you see on your screen, never what YouTube receives.
- **Chrome and Firefox.** Works in both browsers.

## Install (development)

Requires Chrome 152+ or Firefox 128+. Once installed, open https://www.youtube.com — you should see a "Hello from OurTube!" badge in the bottom-right corner.

### Chrome

1. Open `chrome://extensions` and turn on **Developer mode** (top right).
2. Click **Load unpacked** and select this repository's root folder.

After editing files, click the reload icon on the OurTube card in `chrome://extensions`, then refresh the YouTube tab.

### Firefox

Either run `npx web-ext run` from the repository root (requires Node.js; opens a fresh Firefox profile with OurTube loaded and reloads it whenever files change), or:

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and select `manifest.json` in this repository.

Temporary add-ons are removed when Firefox restarts.
