# Release 0.1.0

The first release.

### New features since last release

- YourTube can be installed in Firefox for Android, where it works on YouTube's mobile site.
  [(#24)](https://github.com/jzaia18/YourTube/pull/24)

- The button for joining a channel's paid membership can be hidden from below its videos.
  The popup groups this with hiding the "Ask" button, under "Below videos".
  [(#16)](https://github.com/jzaia18/YourTube/pull/16)

- Shorts can also be hidden on the homepage and in search results.
  The popup groups all three Shorts settings under "Shorts", with a button to select or deselect them all.
  [(#14)](https://github.com/jzaia18/YourTube/pull/14)

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

- The browser's extensions page and the stores show a full name, "YourTube – Your rewritten UI for YouTube", and a description of what it does.
  Space-limited places still say "YourTube".
  [(#22)](https://github.com/jzaia18/YourTube/pull/22)

### Internal changes ⚙️

- Pull request descriptions follow the pull request template, including those opened from the command line, and list only lasting costs as drawbacks.
  [(#26)](https://github.com/jzaia18/YourTube/pull/26)

- Unit tests check that every content CSS rule can be switched off by its setting, that the manifest lists every content CSS file, and that every setting has a popup checkbox and an off value.
  [(#20)](https://github.com/jzaia18/YourTube/pull/20)

- Every setting is described once, with its default and its off value, and CSS-only features need no script of their own.
  Content scripts now load the shared settings and logo destinations directly instead of keeping copies.
  [(#19)](https://github.com/jzaia18/YourTube/pull/19)

- Every pull request must bump the development version in `manifest.json` and add a changelog entry linking back to it.
  [(#3)](https://github.com/jzaia18/YourTube/pull/3)

- Every push to a pull request runs separate checks for the version, the changelog, the unit tests, and `web-ext lint`.
  [(#7)](https://github.com/jzaia18/YourTube/pull/7)

### Documentation 📝

- Added a step-by-step release guide: the release pull request, testing, packaging, and publishing to both stores.
  [(#25)](https://github.com/jzaia18/YourTube/pull/25)

- Added a privacy policy: YourTube collects and sends nothing, and settings sync only through the browser's own sync.
  [(#23)](https://github.com/jzaia18/YourTube/pull/23)

- Added this changelog, pull request and issue templates, and a contributing guide.
  [(#3)](https://github.com/jzaia18/YourTube/pull/3)

### Bug fixes 🐛

- `npm test` works on Node 21 and later.
  [(#6)](https://github.com/jzaia18/YourTube/pull/6)

### Contributors ✍️

This release contains contributions from (in alphabetical order):

Claude,
Jake Zaia

