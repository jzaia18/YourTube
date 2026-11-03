# Releasing YourTube

How to publish a release to the Chrome Web Store and Firefox Add-ons (AMO). Version numbers are
explained under [Versioning](CONTRIBUTING.md#versioning). Only releases go to the stores.

## 1. Prepare the release pull request

1. Branch `release-X.Y.Z` off `main`.
2. In `manifest.json`, set both `version` and `version_name` to `X.Y.Z`.
3. In [`CHANGELOG.md`](CHANGELOG.md), rename the development heading at the top to
   `# Release X.Y.Z`, add a one-line summary below it, and delete any empty sections.
4. If the features changed, update the `description` in `manifest.json` (Chrome allows at most 132
   characters) and the README's opening paragraph to match.
5. If anything YourTube stores, reads, or sends has changed, update [`PRIVACY.md`](../PRIVACY.md)
   and its "Last updated" date.
6. Open the pull request. The version check should report "Release X.Y.Z.", and the changelog
   check skips releases.

## 2. Test by hand

Test every feature before merging:

- in Chrome, Firefox desktop, and Firefox for Android;
- logged in and logged out;
- on www.youtube.com and m.youtube.com.

[`AGENTS.md`](../AGENTS.md#testing) explains how to load the extension in each browser. Make sure
every setting turns its change on and off live, and that the Master switch turns everything off.

## 3. Merge and package

1. Merge the release pull request.
2. In a clean checkout of the merge commit on `main` (`git status` shows nothing untracked, since
   web-ext packages any file not ignored), run `npx web-ext build`. This writes
   `web-ext-artifacts/yourtube-X.Y.Z.zip`; both stores take the same zip. To rebuild, add
   `--overwrite-dest`.
3. Open the zip and check that it holds only `manifest.json`, `icons/`, `src/`, `README.md`,
   `LICENSE`, and `PRIVACY.md`. Development files are listed under `webExt.ignoreFiles` in
   `package.json`.
4. Tag the merge commit `vX.Y.Z` and push the tag (`git push origin vX.Y.Z`). Create a GitHub
   release from the tag, attach the zip, and paste the release's changelog section as its notes.

## 4. Open the next development version

As soon as the release is merged, open a pull request that starts the next release's dev builds.
Later pull requests then have a version to count from and a changelog section for their entries.
This step does not wait for the stores.

1. Branch `dev-X.(Y+1).0` off `main`.
2. In `manifest.json`, set `version` to `X.(Y+1).0.1` and `version_name` to `X.(Y+1).0-dev1` (see
   [Versioning](CONTRIBUTING.md#versioning)).
3. At the top of [`CHANGELOG.md`](CHANGELOG.md), above `# Release X.Y.Z`, add a new development
   section with every category heading, filling in the next version, the pull request number `N`,
   and your name:

   ```markdown
   # Release X.(Y+1).0-dev (development release)

   ### New features since last release

   ### Improvements 🛠

   ### Breaking changes 💔

   ### Deprecations 👋

   ### Internal changes ⚙️

   - Development of X.(Y+1).0 begins.
     [(#N)](https://github.com/jzaia18/YourTube/pull/N)

   ### Documentation 📝

   ### Bug fixes 🐛

   ### Contributors ✍️

   This release contains contributions from (in alphabetical order):

   Your Name
   ```

   The entry under Internal changes is there for the changelog check, which needs every pull
   request to add an entry linking back to it.
4. Open the pull request. The version check should report "On the expected dev version,
   X.(Y+1).0-dev1."

## 5. Chrome Web Store

Dashboard: <https://chrome.google.com/webstore/devconsole>

1. Open the item, go to **Package**, and upload the new zip.
2. **Store listing.** Fill in or check the description (see [Listing text](#listing-text)), the
   category, the language, and the 128×128 icon. Add at least one screenshot (1280×800 or
   640×400). The promo tiles are optional. Screenshots must be taken by hand; a
   before/after of the same page works well.
3. **Privacy practices.** Use the answers under [Listing text](#listing-text): single purpose,
   permission justifications, no remote code, and no data collected. The privacy policy URL is
   <https://github.com/jzaia18/YourTube/blob/main/PRIVACY.md>.
4. **Distribution.** Public, all regions.
5. Click **Submit for review**. A review usually takes a few days, and can take longer when
   permissions change.

## 6. Firefox Add-ons (AMO)

Developer hub: <https://addons.mozilla.org/developers/>

1. Open the add-on, click **Upload New Version**, and upload the zip.
2. When asked whether the add-on needs source code to review, answer **No**: YourTube has no build
   step, so the zip is the source.
3. **Listing.** Fill in or check the summary (at most 250 characters), the description, the
   categories, the support site (<https://github.com/jzaia18/YourTube/issues>), and the license
   (MIT). Screenshots are optional. The privacy policy URL is the same as Chrome's. Mozilla reads
   the data-collection answer ("none") from `manifest.json`.
4. Check that **Firefox for Android** is listed as compatible. The manifest asks for it through
   `browser_specific_settings.gecko_android`.
5. Submit. Signing is usually quick, and a person may review the add-on later.

The add-on ID in `browser_specific_settings.gecko.id` is permanent. Never change it.

## Listing text

- **Summary / short description:** the `description` in `manifest.json`.
- **Detailed description:** the README's opening paragraph and its Features list, followed by
  "YourTube works logged in or out, on YouTube's desktop and mobile sites. It collects no data and
  makes no requests of its own." and the link <https://github.com/jzaia18/YourTube>.
- **Single purpose (Chrome):** "Customizes how YouTube's pages look, with a setting for each
  change."
- **Permission justifications (Chrome):**
  - `storage`: "Saves the user's settings (which page changes are on, and where the YouTube logo
    leads) so they persist between sessions and apply instantly in every open YouTube tab.
    Settings stay in the browser's extension storage and sync only through the browser's own
    sync; nothing is sent to the developer or any server."
  - Host permission: "The extension's only purpose is to change how YouTube's pages look, so its
    content script and stylesheets must run on www.youtube.com (desktop) and m.youtube.com
    (mobile), and only there. They hide elements the user chose to hide and change where the
    YouTube logo leads. activeTab is not suitable because the changes must apply automatically
    on every YouTube page, including in-app navigation, without the user clicking the toolbar
    button each time. The extension makes no network requests, does not read or modify
    YouTube's traffic, and collects no data from the pages."

    Chrome counts the content script's `matches` as host access, and warns that it may need an
    in-depth review. Every extension with host access sees this warning; keep the matches to
    YouTube's own sites so the review stays short.
- **Remote code (Chrome):** No. All code is in the package.
- **Data use (Chrome):** No user data is collected. Check every certification box.
