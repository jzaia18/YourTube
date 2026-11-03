# YourTube
Put YouTube back in *Your* hands

A browser extension for Chrome and Firefox that rewrites the YouTube UI.

## Principles

- **You're in control.** Every change YourTube makes can be switched off in its settings, and toggles apply instantly.
- **Still YouTube.** Changes are subtle and match YouTube's own look.
- **Signed in or not.** Everything works whether or not you're logged in.
- **Looks only.** YourTube changes what you see on your screen. It never sends anything to YouTube on its own; at most, a link leads somewhere new when you click it.
- **Chrome and Firefox.** Works in both browsers, including Firefox for Android.
- **Everywhere on YouTube.** Works on YouTube's desktop and mobile sites, and in embedded videos.

## Features

Configure everything from the YourTube button in the browser toolbar.

- **Logo link:** choose where the YouTube logo takes you: the homepage (YouTube's default), Subscriptions, Watch later, or any YouTube page you like.
- **Hide ads around videos:** remove the ads YouTube places beside, between, and above videos. Ads inside the player still play.
- **Hide the Ask button:** remove YouTube's AI "Ask" button from videos.
- **Hide the Join button:** remove the button for joining a channel's paid membership from below its videos. It stays on the channel's page.
- **Hide channel stores below videos:** remove the shelf of products a channel sells from below its videos.
- **Hide Shorts:** on the homepage, in Subscriptions, and/or in search results, each separately configurable -- it's your choice.
- **Tidy the sidebar (Guide):** hide its Explore and More from YouTube sections, separately.

## Privacy

YourTube collects no data and sends nothing anywhere; your settings stay in your browser. See the
[privacy policy](PRIVACY.md).

## Install (development)

Requires Chrome 152+ or Firefox 147+.

### Chrome

1. Open `chrome://extensions` and turn on **Developer mode** (top right).
2. Click **Load unpacked** and select this repository's root folder.

After editing files, click the reload icon on the YourTube card in `chrome://extensions`, then refresh the YouTube tab.

### Firefox

Either run `npx web-ext run` from the repository root (requires Node.js; opens a fresh Firefox profile with YourTube loaded and reloads it whenever files change), or:

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and select `manifest.json` in this repository.

Temporary add-ons are removed when Firefox restarts.

For Firefox for Android, run `npx web-ext run -t firefox-android --android-device <device id>`
with the phone connected over USB debugging (see [Mozilla's guide](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/)).

### Tests

`npm test` runs the unit tests (Node.js 18+, no dependencies to install).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for pull requests, the changelog, and versioning.
