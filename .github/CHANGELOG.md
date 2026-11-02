# Release 0.1.0-dev (development release)

### New features since last release

- Ads YouTube places beside, between, and above videos can be hidden; ads inside the player are untouched.
  The popup groups this with hiding channel stores, under "Ads and shopping".
  [(#12)](https://github.com/jzaia18/YourTube/pull/12)

- The shelf of products a channel sells can be hidden from below its videos.
  [(#9)](https://github.com/jzaia18/YourTube/pull/9)

- The YouTube logo can lead to Subscriptions, Watch later, or any YouTube page instead of the homepage.

- YouTube's AI "Ask" button can be hidden on videos.

- Shorts can be hidden from the Subscriptions feed.

- The sidebar (Guide) can hide its Explore and More from YouTube sections, separately.

- Every setting has a tooltip explaining what it changes.

### Improvements 🛠

### Breaking changes 💔

### Deprecations 👋

### Internal changes ⚙️

- Every pull request must bump the development version in `manifest.json` and add a changelog entry linking back to it.
  [(#3)](https://github.com/jzaia18/YourTube/pull/3)

- Every push to a pull request runs separate checks for the version, the changelog, the unit tests, and `web-ext lint`.
  [(#7)](https://github.com/jzaia18/YourTube/pull/7)

### Documentation 📝

- Added this changelog, pull request and issue templates, and a contributing guide.
  [(#3)](https://github.com/jzaia18/YourTube/pull/3)

### Bug fixes 🐛

- `npm test` works on Node 21 and later.
  [(#6)](https://github.com/jzaia18/YourTube/pull/6)

### Contributors ✍️

This release contains contributions from (in alphabetical order):

Claude,
Jake Zaia

